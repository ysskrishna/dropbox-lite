# Dropbox - Lite API

This is the API service for the Dropbox-Lite application. It is built with FastAPI and uses MinIO for object storage.

## Tech Stack
- FastAPI
- MinIO
- SQLite
- SQLAlchemy


## Prerequisites

- Python 3.8+
- pip
- virtualenv

## Initial Setup

1. Create a virtual environment:
   ```
   virtualenv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     .\venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```



## Development

### Running the Development Server

Start the FastAPI server:
```
python main.py
```

The server will be available at `http://localhost:8081/`

### API Documentation

Access the Swagger UI documentation at `http://localhost:8081/docs`

### Updating Dependencies

After adding or removing packages, update the requirements file:
```
pip freeze > requirements.txt
```
