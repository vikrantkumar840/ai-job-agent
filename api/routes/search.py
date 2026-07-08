from fastapi import APIRouter
from vector.retriever import search_jobs

router = APIRouter()

@router.post("/jobs")
def search_jobs_api(payload: dict):
    query = payload.get("query", "")
    session_id = payload.get("session_id", "")
    limit = payload.get("limit", 10)

    return search_jobs(
        query=query,
        session_id=session_id,
        limit=limit,
    )
