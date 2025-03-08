from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .routers import router
from .dependencies import get_db_service

app = FastAPI(title="Authentication API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, tags=["Authentication"])


# Startup event
@app.on_event("startup")
async def startup_event():
    db = await get_db_service()
    print("Connected to MongoDB")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    db = await get_db_service()
    await db.disconnect()
    print("Disconnected from MongoDB")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
