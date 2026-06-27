from fastapi import APIRouter

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


@router.get("/")
def settings():
    return {
        "message": "Settings endpoint"
    }
