from datetime import datetime

from database.mongodb import db


def save_session(session: dict):

    session["created_at"] = datetime.utcnow()

    result = db.sessions.insert_one(session)

    return str(result.inserted_id)


def get_user_sessions(user_id: int):

    return list(
        db.sessions.find(
            {"user_id": user_id},
            {"_id": 0},
        ).sort("created_at", -1)
    )


def get_session(session_id: str):

    return db.sessions.find_one(
        {"session_id": session_id},
        {"_id": 0},
    )
