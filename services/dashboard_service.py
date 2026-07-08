from database.mongodb import resume_history
from database.mongodb import job_sessions
from database.mongodb import cover_letters

from sqlalchemy.orm import Session

from database.models import Application


def get_sessions(user_id):
    return list(
        job_sessions.find(
            {
                "user_id": user_id,
            },
            {
                "_id": 0,
            },
        )
    )


def get_session(
    user_id,
    session_id,
):
    return job_sessions.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        },
        {
            "_id": 0,
        },
    )


def get_resumes(user_id):
    return list(
        resume_history.find(
            {
                "user_id": user_id,
            },
            {
                "_id": 0,
            },
        )
    )


def get_cover_letters(user_id):
    return list(
        cover_letters.find(
            {
                "user_id": user_id,
            },
            {
                "_id": 0,
            },
        )
    )


def get_applications(
    db: Session,
    user_id,
):
    return (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .all()
    )
