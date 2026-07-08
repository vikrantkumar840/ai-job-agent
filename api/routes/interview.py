from fastapi import APIRouter

from services.interview_service import interview


router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)


@router.post("/")
def prepare(payload: dict):

    return interview(
        payload["user_id"],
        payload["session_id"],
    )
