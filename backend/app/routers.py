from fastapi import APIRouter, Depends, Response, Cookie
from typing import Optional
import secrets
from passlib.context import CryptContext
from datetime import datetime

from .models import (
    UserCredentials,
    BaseResponse,
    UsernameValidationRequest,
    UsernameValidationResponse,
    SessionValidationResponse,
)
from .core.services.mongo_db_service import MongoDBService
from .dependencies import get_db_service
from .utils import validate_username, validate_password


router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register", response_model=BaseResponse)
async def register(
    credentials: UserCredentials, db: MongoDBService = Depends(get_db_service)
):
    # Validate username
    if not validate_username(credentials.username):
        return BaseResponse(
            success=False, message="Username must be at least 8 characters"
        )

    # Validate password
    if not validate_password(credentials.password):
        return BaseResponse(
            success=False,
            message="Password must contain at least 1 lowercase, 1 uppercase, and 1 special character",
        )

    # Check if username exists
    existing_user = await db.find_user_by_username(credentials.username)
    if existing_user:
        return BaseResponse(success=False, message="Username already taken")

    # Hash password and create user
    hashed_password = pwd_context.hash(credentials.password)
    user_id = await db.create_user(credentials.username, hashed_password)

    # Create session token
    session_token = secrets.token_hex(32)
    await db.create_session(user_id, session_token)

    return BaseResponse(success=True)


@router.post("/login", response_model=BaseResponse)
async def login(
    credentials: UserCredentials,
    response: Response,
    db: MongoDBService = Depends(get_db_service),
):
    # Find the user
    user = await db.find_user_by_username(credentials.username)
    if not user:
        return BaseResponse(success=False, message="Invalid username or password")

    # Verify password
    if not pwd_context.verify(credentials.password, user["password"]):
        return BaseResponse(success=False, message="Invalid username or password")

    # Create session token
    session_token = secrets.token_hex(32)
    expiry = await db.create_session(str(user["_id"]), session_token)

    # Set cookie with session token
    response.set_cookie(
        key="session",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="lax",
        expires=int(expiry.timestamp()),
    )

    return BaseResponse(success=True)


@router.post("/validate-session", response_model=SessionValidationResponse)
async def validate_session(
    response: Response,
    session: Optional[str] = Cookie(None),
    db: MongoDBService = Depends(get_db_service),
):
    if not session:
        response.delete_cookie(key="session")
        return SessionValidationResponse(success=False)

    session_data = await db.find_session(session)
    if not session_data:
        response.delete_cookie(key="session")
        return SessionValidationResponse(success=False)

    # Check if session has expired
    if session_data["expiry"] < datetime.utcnow():
        await db.delete_session(session)
        response.delete_cookie(key="session")
        return SessionValidationResponse(success=False)

    # Get user data
    user = await db.find_one("userTable", {"_id": session_data["userId"]})
    if not user:
        response.delete_cookie(key="session")
        return SessionValidationResponse(success=False)

    return SessionValidationResponse(success=True, username=user["username"])


@router.post("/validate-username", response_model=UsernameValidationResponse)
async def validate_username_endpoint(
    data: UsernameValidationRequest, db: MongoDBService = Depends(get_db_service)
):
    # Check if username is long enough
    if not validate_username(data.username):
        return UsernameValidationResponse(success=True, available=False)

    # Check if username exists
    user = await db.find_user_by_username(data.username)

    return UsernameValidationResponse(success=True, available=user is None)


@router.post("/logout", response_model=BaseResponse)
async def logout(
    response: Response,
    session: Optional[str] = Cookie(None),
    db: MongoDBService = Depends(get_db_service),
):
    if session:
        await db.delete_session(session)

    response.delete_cookie(key="session")
    return BaseResponse(success=True)
