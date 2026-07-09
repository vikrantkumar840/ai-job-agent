from datetime import datetime, timedelta, timezone

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.models import RefreshToken
from database.models import User
from database.postgres import get_db

from auth.dependencies import get_current_user
from auth.hash import hash_password
from auth.hash import verify_password
from auth.jwt import create_access_token
from auth.jwt import create_refresh_token
from auth.jwt import decode_token

from auth.schemas import LoginRequest
from auth.schemas import MessageResponse
from auth.schemas import RefreshTokenRequest
from auth.schemas import SignupRequest
from auth.schemas import TokenResponse
from auth.schemas import UserResponse


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/signup",
    response_model=TokenResponse,
)
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db),
):

    existing = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists.",
        )

    user = User(
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password(request.password),
        credits=5,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
        }
    )

    refresh_token = create_refresh_token(
        {
            "user_id": user.id,
        }
    )

    db.add(
        RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=30),
        )
    )

    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user,
    }


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    user.last_login = datetime.now(timezone.utc)

    access_token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
        }
    )

    refresh_token = create_refresh_token(
        {
            "user_id": user.id,
        }
    )

    db.add(
        RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=30),
        )
    )

    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):

    token_db = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == request.refresh_token,
            RefreshToken.revoked == False,
        )
        .first()
    )

    if not token_db:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    payload = decode_token(request.refresh_token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type",
        )

    user = (
        db.query(User)
        .filter(User.id == token_db.user_id)
        .first()
    )

    access_token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": request.refresh_token,
        "token_type": "bearer",
        "user": user,
    }


@router.post(
    "/logout",
    response_model=MessageResponse,
)
def logout(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):

    token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == request.refresh_token
        )
        .first()
    )

    if token:
        token.revoked = True
        db.commit()

    return {
        "message": "Logged out successfully"
    }
