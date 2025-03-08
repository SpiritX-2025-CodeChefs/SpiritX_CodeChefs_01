from pydantic import BaseModel


class UserCredentials(BaseModel):
    username: str
    password: str


class BaseResponse(BaseModel):
    success: bool
    message: str = None


class UsernameValidationRequest(BaseModel):
    username: str


class UsernameValidationResponse(BaseModel):
    success: bool
    available: bool


class SessionValidationResponse(BaseModel):
    success: bool
    username: str = None
