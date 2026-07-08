from database.models import Application
from sqlalchemy.orm import Session


def application_stats(db: Session, user_id: int):

    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .all()
    )

    total = len(applications)

    pending = len(
        [
            a
            for a in applications
            if a.status == "Pending"
        ]
    )

    applied = len(
        [
            a
            for a in applications
            if a.status == "Applied"
        ]
    )

    interview = len(
        [
            a
            for a in applications
            if a.status == "Interview"
        ]
    )

    rejected = len(
        [
            a
            for a in applications
            if a.status == "Rejected"
        ]
    )

    selected = len(
        [
            a
            for a in applications
            if a.status == "Selected"
        ]
    )

    return {
        "total": total,
        "pending": pending,
        "applied": applied,
        "interview": interview,
        "rejected": rejected,
        "selected": selected,
    }
