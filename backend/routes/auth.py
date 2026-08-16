"""
routes/auth.py – POST /auth/register and POST /auth/login
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from backend.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Create a new user account.

    - **username**: 3–100 characters
    - **email**: valid email address
    - **password**: minimum 6 characters (stored as bcrypt hash)
    """
    user = auth_service.register_user(db, data)
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate and receive a JWT access token.

    Use the returned `access_token` in the `Authorization: Bearer <token>` header
    for all protected endpoints.
    """
    user = auth_service.authenticate_user(db, data.email, data.password)
    token = auth_service.create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)
