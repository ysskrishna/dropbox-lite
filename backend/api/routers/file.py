from fastapi import APIRouter, HTTPException, File, UploadFile, Depends, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.s3 import S3Client
from core.dbutils import get_db
from models.models import File as FileModel, FileChunk as FileChunkModel
from models import schemas
import uuid
from typing import List
from io import BytesIO

router = APIRouter()
s3_client = S3Client()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        print(f"Uploading file: {file.filename} to {unique_filename}")
        
        s3_path = await s3_client.upload_fileobj(
            file.file,
            unique_filename,
            {"ContentType": file.content_type}
        )
        
        db_file = FileModel(
            name=file.filename,
            path=s3_path,
            content_type=file.content_type
        )
        db.add(db_file)
        await db.commit()
        
        return {
            "filename": file.filename,
            "stored_filename": unique_filename,
            "path": s3_path
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed. Please try again. {str(e)}")

@router.post("/v2/upload")
async def upload_file(
    fileinfo: schemas.FileV2UploadSchema,
    db: AsyncSession = Depends(get_db)
):
    try:
        file_extension = fileinfo.name.split('.')[-1] if '.' in fileinfo.name else ''
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        print(f"Got upload request for file: {fileinfo.name} to {unique_filename}")

        # Create initial file record
        db_file = FileModel(
            name=fileinfo.name,
            path="",
            content_type=fileinfo.content_type,
            size=fileinfo.size,
            chunk_count=fileinfo.chunk_count
        )
        db.add(db_file)
        await db.commit()
        await db.refresh(db_file)
        print(f"File {db_file.id} created")

        return {
            "file_id": db_file.id,
            "filename": fileinfo.name,
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed. Please try again. {str(e)}")

@router.post("/v2/upload/chunk")
async def upload_file_chunk(
    file_id: int = Form(...),  # Getting form data
    chunk_index: int = Form(...),  # Getting form data
    file: UploadFile = File(...),  # Getting the file
    db: AsyncSession = Depends(get_db)  # Database dependency
):
    try:
        # upload chunk to s3
        unique_filename = f"{file_id}_{chunk_index}"
        chunk_s3_path = await s3_client.upload_fileobj(
            file.file,
            unique_filename,
            {"ContentType": file.content_type}
        )
    
        # create file_chunk record
        db_file_chunk = FileChunkModel(
            file_id=file_id,
            chunk_index=chunk_index,
            chunk_path=chunk_s3_path
        )
        db.add(db_file_chunk)
        await db.commit()

        print(f"File chunk {chunk_index} uploaded to {chunk_s3_path}")

        return {
            "file_id": file_id,
            "chunk_index": chunk_index,
            "chunk_path": chunk_s3_path
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed. Please try again. {str(e)}")


@router.get("/list", response_model=List[dict])
async def list_files(db: AsyncSession = Depends(get_db)):
    try:
        query = select(FileModel)
        result = await db.execute(query)
        files = result.scalars().all()
        
        return [
            {
                "id": file.id,
                "name": file.name,
                "path": file.path,
                "created_at": file.created_at,
                "updated_at": file.updated_at
            }
            for file in files
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list files: {str(e)}")

@router.get("/download/{file_id}")
async def download_file(file_id: int, db: AsyncSession = Depends(get_db)):
    try:
        # Get file metadata
        query = select(FileModel).where(FileModel.id == file_id)
        result = await db.execute(query)
        file = result.scalar_one_or_none()
        
        if not file:
            raise HTTPException(status_code=404, detail="File not found")

        # Check if file is chunked
        if file.path.startswith("chunks/"):
            # Get all chunks ordered by index
            chunks_query = select(FileChunks).where(
                FileChunks.file_id == file_id
            ).order_by(FileChunks.chunk_index)
            chunks_result = await db.execute(chunks_query)
            chunks = chunks_result.scalars().all()
            
            if not chunks:
                raise HTTPException(status_code=404, detail="File chunks not found")
            
            # Create a BytesIO buffer to store the complete file
            complete_file = BytesIO()
            
            # Download and combine all chunks
            for chunk in chunks:
                chunk_data = await s3_client.download_fileobj(chunk.chunk_path)
                complete_file.write(chunk_data)
            
            # Reset buffer position
            complete_file.seek(0)
            
            return StreamingResponse(
                complete_file,
                media_type=file.content_type or "application/octet-stream",
                headers={
                    "Content-Disposition": f'attachment; filename="{file.name}"'
                }
            )
        else:
            # Handle non-chunked files (original implementation)
            file_obj = await s3_client.download_fileobj(file.path)
            return StreamingResponse(
                BytesIO(file_obj),
                media_type=file.content_type or "application/octet-stream",
                headers={
                    "Content-Disposition": f'attachment; filename="{file.name}"'
                }
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download file: {str(e)}")
