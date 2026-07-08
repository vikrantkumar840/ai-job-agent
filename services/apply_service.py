from database.mongodb import ai_outputs
from services.application_service import create_application


def apply_to_job(
    db,
    user_id,
    session_id,
    company,
    role,
):
    ai_data = ai_outputs.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        },
        {
            "_id": 0,
        },
    )

    if not ai_data:
        return {
            "error": "AI output not found."
        }

    application = create_application(
        db=db,
        user_id=user_id,
        company=company,
        role=role,
        status="Applied",
    )

    return {
        "application": application,
        "resume": ai_data["resume"],
        "cover_letter": ai_data["cover_letter"],
    }
