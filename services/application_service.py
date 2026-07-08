from datetime import datetime

from sqlalchemy.orm import Session

from database.models import Application


def create_application(
    db: Session,
    user_id: int,
    company: str,
    role: str,
    status: str = "Pending",
):
    application = Application(
        user_id=user_id,
        company=company,
        role=role,
        status=status,
        applied_at=datetime.utcnow(),
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def get_user_applications(
    db: Session,
    user_id: int,
):
    return (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def update_application_status(
    db: Session,
    application_id: int,
    status: str,
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        return None

    application.status = status

    db.commit()
    db.refresh(application)

    return application

def get_application(
    db: Session,
    application_id: int,
):
    return (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )
