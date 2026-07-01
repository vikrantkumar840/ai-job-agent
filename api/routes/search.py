# api/routes/search.py

from fastapi import APIRouter
from vector.retriever import search_jobs

router = APIRouter()

@router.post("/jobs")
def search_jobs_api(payload: dict):
    query = payload.get("query", "")
    return search_jobs(query)
