from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from database.postgres import get_db

from services.dashboard_service import (
    get_sessions,
    get_session,
    get_resumes,
    get_cover_letters,
    get_applications,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/sessions/{user_id}")
def sessions(user_id: int):

    return get_sessions(user_id)


@router.get("/session/{user_id}/{session_id}")
def session(
    user_id: int,
    session_id: str,
):

    return get_session(
        user_id,
        session_id,
    )


@router.get("/resumes/{user_id}")
def resumes(user_id: int):

    return get_resumes(user_id)


@router.get("/cover-letters/{user_id}")
def cover_letters(user_id: int):

    return get_cover_letters(user_id)


@router.get("/applications/{user_id}")
def applications(
    user_id: int,
    db: Session = Depends(get_db),
):

    return get_applications(
        db,
        user_id,
    )
