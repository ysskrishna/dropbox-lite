from fastapi import APIRouter, HTTPException, File, UploadFile

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"Uploading file: {file.filename}")
        return {"filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed. Please try again. {e}")
