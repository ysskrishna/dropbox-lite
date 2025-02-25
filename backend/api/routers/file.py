from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.s3 import S3Client
from core.dbutils import get_db
from models.models import File as FileModel
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
        query = select(FileModel).where(FileModel.id == file_id)
        result = await db.execute(query)
        file = result.scalar_one_or_none()
        
        if not file:
            raise HTTPException(status_code=404, detail="File not found")
        
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
