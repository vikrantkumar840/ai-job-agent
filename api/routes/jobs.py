from fastapi import APIRouter
from api.services.job_service import get_jobs

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get("/")
def jobs():
    return get_jobs()
