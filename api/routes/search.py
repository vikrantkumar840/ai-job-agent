from fastapi import APIRouter
from api.models.search import JobSearchRequest
from tools.job_search import search_jobs

router = APIRouter()

@router.post("/")
def search(request: JobSearchRequest):

    return search_jobs(
        role=request.role,
        city=request.city
    )
