from datetime import datetime

from database.mongodb import chat_history


def save_message(
    user_id,
    session_id,
    role,
    message,
):
    chat_history.insert_one(
        {
            "user_id": user_id,
            "session_id": session_id,
            "role": role,
            "message": message,
            "created_at": datetime.utcnow(),
        }
    )


def get_messages(
    user_id,
    session_id,
):
    return list(
        chat_history.find(
            {
                "user_id": user_id,
                "session_id": session_id,
            },
            {
                "_id": 0,
            },
        ).sort("created_at", 1)
    )
