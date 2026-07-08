from fastapi import APIRouter

from services.chat_service import chat_with_ai

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"],
)


@router.post("/")
def chat(payload: dict):

    return chat_with_ai(
        user_id=payload["user_id"],
        session_id=payload["session_id"],
        message=payload["message"],
    )
