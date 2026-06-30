from fastapi import APIRouter

from api.models.profile import ProfileRequest
from agents.profile_agent import extract_profile

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.post("/extract")
def profile(request: ProfileRequest):

    profile = extract_profile(request.resume_text)

    return {
        "profile": profile
    }
