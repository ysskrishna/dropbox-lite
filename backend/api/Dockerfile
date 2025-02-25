# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Copy api package (now relative to backend directory)
COPY api/ /app/api/

# Set working directory to api folder
WORKDIR /app/api

# Install Python dependencies including the local package
RUN pip install --no-cache-dir -r requirements.txt

# Command to run the FastAPI server
CMD ["python", "main.py"]