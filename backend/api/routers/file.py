from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.s3 import S3Client
from core.dbutils import get_db
from models.models import File as FileModel
import uuid

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
            path=s3_path
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
