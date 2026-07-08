from database.mongodb import job_sessions
from database.mongodb import interview_sessions

from agents.interview_agent import generate_questions


def interview(user_id, session_id):

    session = job_sessions.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        }
    )

    if not session:
        return {"error": "Session not found"}

    job = session["selected_jobs"][0]

    questions = generate_questions(job)

    interview_sessions.insert_one(
        {
            "user_id": user_id,
            "session_id": session_id,
            "questions": questions,
        }
    )

    return {
        "questions": questions
    }
