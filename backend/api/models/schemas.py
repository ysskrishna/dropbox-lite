from pydantic import BaseModel

class FileV2UploadSchema(BaseModel):
    name: str
    content_type: str
    size: int
    chunk_count: int
