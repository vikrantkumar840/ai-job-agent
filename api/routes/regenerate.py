from fastapi import APIRouter

from database.mongodb import ai_outputs
from services.resume_version_service import save_resume_version

from agents.resume_agent import generate_resume
from agents.cover_letter_agent import generate_cover_letter

router = APIRouter(
    prefix="/regenerate",
    tags=["Regenerate"],
)


@router.post("/resume")
def regenerate_resume(payload: dict):

    user_id = payload["user_id"]
    session_id = payload["session_id"]

    data = ai_outputs.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        }
    )

    if not data:
        return {"error": "Workflow not found"}

    new_resume = generate_resume(
        data["resume"],
        data["cover_letter"],
    )

    save_resume_version(
        user_id=user_id,
        session_id=session_id,
        resume=new_resume,
    )

    return {
        "resume": new_resume,
    }


@router.post("/cover-letter")
def regenerate_cover_letter(payload: dict):

    user_id = payload["user_id"]
    session_id = payload["session_id"]

    data = ai_outputs.find_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        }
    )

    if not data:
        return {"error": "Workflow not found"}

    letter = generate_cover_letter(
        data["resume"]
    )

    ai_outputs.update_one(
        {
            "user_id": user_id,
            "session_id": session_id,
        },
        {
            "$set": {
                "cover_letter": letter
            }
        }
    )

    return {
        "cover_letter": letter,
    }
