# Authentication API Backend

A FastAPI-based authentication service with MongoDB for user management and session handling.

## Features

- User registration and login system
- Password hashing with bcrypt
- Session management with secure cookies
- Username validation and availability checking
- MongoDB integration for data persistence

## Requirements

- Python 3.10+
- MongoDB
- Docker (optional)

## Installation

### Setting up the environment

1. Clone the repository:

```bash
git clone <repository-url>
cd SpiritX_CodeChefs_01/backend
```

2. Create a virtual environment and activate it and Install dependencies:

```bash
uv sync
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### Setting up MongoDB

1. Install MongoDB locally or use a cloud service
2. Make sure MongoDB is running (default: localhost:27017)

### Configure environment variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Modify the .env file with your MongoDB connection details:

```bash
MONGO_URI=mongodb://localhost:27017
DB_NAME=auth_db
```

## Running the Application

### Local Development

Run the application with uvicorn:

```bash
uv run fastapi dev
```

Or directly with uvicorn:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using Docker

Build and run the Docker container:

```bash
docker build -t auth-api .
docker run -p 8000:8000 --env-file .env auth-api
```

## API Endpoints

- POST /register: Register a new user
- POST /login: Log in a user and set session cookie
- POST /validate-username: Check if a username is available
- POST /validate-session: Validate user session
- POST /logout: Log out current user and clear session

## API Documentation

Once the application is running, access the auto-generated API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Security Notes

- In production, restrict CORS settings
- Use HTTPS for API endpoints
- Store sensitive information securely
