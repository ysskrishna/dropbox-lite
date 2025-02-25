from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.file import router as file_router

app = FastAPI()

app.include_router(file_router, prefix="/api/file", tags=["file"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "dropbox-lite-api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)