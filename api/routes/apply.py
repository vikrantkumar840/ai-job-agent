from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from database.postgres import get_db
from services.apply_service import apply_to_job

router = APIRouter(
    prefix="/apply",
    tags=["Apply"],
)


@router.post("/")
def apply(
    payload: dict,
    db: Session = Depends(get_db),
):
    return apply_to_job(
        db=db,
        user_id=payload["user_id"],
        session_id=payload["session_id"],
        company=payload["company"],
        role=payload["role"],
    )
