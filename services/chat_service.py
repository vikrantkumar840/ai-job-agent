from database.mongodb import ai_outputs
from database.mongodb import job_sessions

from agents.chat_agent import chat

from services.chat_history_service import save_message
from services.chat_history_service import get_messages


def chat_with_ai(
    user_id,
    session_id,
    message,
):
    ai = ai_outputs.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        }
    )

    session = job_sessions.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        }
    )

    if not ai or not session:
        return {
            "error": "Session not found"
        }

    history = get_messages(
        user_id,
        session_id,
    )

    save_message(
        user_id,
        session_id,
        "user",
        message,
    )

    answer = chat(
        resume=ai["resume"],
        cover_letter=ai["cover_letter"],
        jobs=session["selected_jobs"],
        history=history,
        question=message,
    )

    save_message(
        user_id,
        session_id,
        "assistant",
        answer,
    )

    return {
        "answer": answer
    }
