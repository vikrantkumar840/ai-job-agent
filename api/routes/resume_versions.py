from fastapi import APIRouter

from database.mongodb import resume_versions

router = APIRouter(
    prefix="/resume-versions",
    tags=["Resume Versions"],
)


@router.get("/{user_id}/{session_id}")
def get_versions(
    user_id: int,
    session_id: str,
):

    return list(
        resume_versions.find(
            {
                "user_id": user_id,
                "session_id": session_id,
            },
            {
                "_id": 0,
            },
        )
    )
