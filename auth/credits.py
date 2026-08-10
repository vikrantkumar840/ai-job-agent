from datetime import datetime, timezone

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from auth.dependencies import get_current_active_user
from database.models import User
from database.postgres import get_db


def _has_active_pro_plan(user: User) -> bool:
    if user.plan != "pro":
        return False
    if user.plan_expires_at is None:
        return True
    return user.plan_expires_at > datetime.now(timezone.utc)


def require_credit(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Gate for any paid action (auto-apply, resume generation, AI chat, etc).
    Pro users pass through unlimited. Free users get 1 credit deducted per
    call and are rejected with 402 once they hit zero.
    """
    if _has_active_pro_plan(current_user):
        return current_user

    if current_user.credits <= 0:
        raise HTTPException(
            status_code=402,
            detail="You've used all your free credits. Upgrade to Pro for unlimited access.",
        )

    current_user.credits -= 1
    db.commit()
    db.refresh(current_user)

    return current_user
