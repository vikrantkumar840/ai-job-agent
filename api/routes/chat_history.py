from fastapi import APIRouter

from services.chat_history_service import get_messages

router = APIRouter(
    prefix="/chat-history",
    tags=["Chat History"],
)


@router.get("/{user_id}/{session_id}")
def history(
    user_id: int,
    session_id: str,
):
    return get_messages(
        user_id,
        session_id,
    )
