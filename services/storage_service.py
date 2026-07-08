from database.mongodb import db
from datetime import datetime
import uuid


def save_session(
    user_id: int,
    resume_text: str,
    profile: dict,
    preferences: dict,
    jobs: list,
    ranked_jobs: list,
    selected_jobs: list,
    resume: str,
    cover_letter: str,
):
    session_id = str(uuid.uuid4())

    document = {
        "session_id": session_id,
        "user_id": user_id,
        "resume_text": resume_text,
        "profile": profile,
        "preferences": preferences,
        "jobs": jobs,
        "ranked_jobs": ranked_jobs,
        "selected_jobs": selected_jobs,
        "resume": resume,
        "cover_letter": cover_letter,
        "created_at": datetime.utcnow(),
    }

    db.sessions.insert_one(document)

    return session_id
