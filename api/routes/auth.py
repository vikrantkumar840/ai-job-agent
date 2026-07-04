from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.postgres import get_db
from database.models import User

from auth.schemas import SignupRequest
from auth.schemas import LoginRequest

from auth.hash import hash_password
from auth.hash import verify_password

from auth.jwt import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/signup")
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db),
):

    existing = db.query(User).filter(
        User.email == request.email
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already exists.",
        )

    user = User(
        full_name=request.full_name,
        email=request.email,
        password=hash_password(request.password),
        credits=5,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
        }
    )

    return {
        "token": token,
        "user_id": user.id,
    }


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        request.password,
        user.password,
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
        }
    )

    return {
        "token": token,
        "user_id": user.id,
    }
