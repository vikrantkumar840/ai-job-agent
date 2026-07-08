from fastapi import APIRouter

from services.ats_service import ats_score

router = APIRouter(
    prefix="/ats",
    tags=["ATS"],
)


@router.post("/score")
def score(payload: dict):

    return ats_score(
        payload["user_id"],
        payload["session_id"],
    )
