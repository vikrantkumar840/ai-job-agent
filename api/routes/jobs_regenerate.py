from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database.search_session_store import init_search_sessions_table, get_search_session
from tools.job_search import search_jobs

init_search_sessions_table()

router = APIRouter(prefix="/jobs", tags=["jobs"])


class RegenerateRequest(BaseModel):
    user_id: int
    session_id: str
    jobs_count: int = 25


@router.post("/regenerate")
async def regenerate_jobs(payload: RegenerateRequest):
    session = get_search_session(payload.session_id)

    if not session:
        raise HTTPException(
            status_code=404,
            detail="No stored search context for this session. Run a search first.",
        )

    try:
        result = search_jobs(
            role=session["role"],
            city=session["city"],
            websites=session["websites"],
            experience=session["experience"],
            limit=payload.jobs_count,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Regenerate search failed: {str(e)}")

    return result["jobs"]
