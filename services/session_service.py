from datetime import datetime
from uuid import uuid4

from database.mongodb import job_sessions
from database.mongodb import resume_history
from database.mongodb import cover_letters
from database.mongodb import ai_outputs


def save_resume(
    user_id,
    resume_text,
    profile,
):
    resume_history.insert_one(
        {
            "user_id": user_id,
            "resume_id": str(uuid4()),
            "resume_text": resume_text,
            "profile": profile,
            "created_at": datetime.utcnow(),
        }
    )


def save_session(
    user_id,
    session_id,
    jobs,
    ranked_jobs,
    selected_jobs,
):
    job_sessions.insert_one(
        {
            "user_id": user_id,
            "session_id": session_id,
            "jobs": jobs,
            "ranked_jobs": ranked_jobs,
            "selected_jobs": selected_jobs,
            "created_at": datetime.utcnow(),
        }
    )


def save_cover_letter(
    user_id,
    session_id,
    cover_letter,
):
    cover_letters.insert_one(
        {
            "user_id": user_id,
            "session_id": session_id,
            "cover_letter": cover_letter,
            "created_at": datetime.utcnow(),
        }
    )


def save_ai_output(
    user_id,
    session_id,
    resume,
    cover_letter,
):
    ai_outputs.insert_one(
        {
            "user_id": user_id,
            "session_id": session_id,
            "resume": resume,
            "cover_letter": cover_letter,
            "created_at": datetime.utcnow(),
        }
    )
