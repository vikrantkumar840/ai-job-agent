from fastapi import APIRouter
from fastapi import Depends
from agents.interview_agent import generate_questions

from sqlalchemy.orm import Session

from database.postgres import get_db

from services.application_service import (
    create_application,
    get_user_applications,
    update_application_status,
    get_application,
    )

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.post("/apply")
def apply(
    payload: dict,
    db: Session = Depends(get_db),
):
    return create_application(
        db=db,
        user_id=payload["user_id"],
        company=payload["company"],
        role=payload["role"],
    )


@router.get("/{user_id}")
def applications(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_user_applications(
        db,
        user_id,
    )


@router.put("/{application_id}")
def update(
    application_id: int,
    payload: dict,
    db: Session = Depends(get_db),
):
    return update_application_status(
        db,
        application_id,
        payload["status"],
    )
@router.get("/{application_id}/interview")
def interview(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = get_application(
        db,
        application_id,
    )

    if not application:
        return {
            "error": "Application not found"
        }

    questions = generate_questions(
        application.role
    )

    return {
        "company": application.company,
        "role": application.role,
        "status": application.status,
        "questions": questions,
    }
