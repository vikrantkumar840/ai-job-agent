from database.mongodb import ai_outputs
from database.mongodb import job_sessions

from agents.ats_agent import score_resume


def ats_score(
    user_id,
    session_id,
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

    job = session["selected_jobs"][0]

    return score_resume(
        ai["resume"],
        job,
    )
