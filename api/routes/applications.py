from fastapi import APIRouter

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.get("/")
def applications():
    return {
        "message": "Applications endpoint"
    }
