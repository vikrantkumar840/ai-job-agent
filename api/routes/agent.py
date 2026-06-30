from fastapi import APIRouter
from workflows.graph import workflow
from tools.job_search import search_jobs

router = APIRouter(
    prefix="/agent",
    tags=["AI Agent"]
)


@router.post("/run")
def run_agent(payload: dict):

    resume_text = payload.get("resume_text", "")
    profile = payload.get("profile", {})
    preferences = payload.get("preferences", {})

    # STEP 1: fetch jobs
    jobs = payload.get("jobs", [])

    if not jobs:
        jobs = search_jobs(
            role=preferences.get("role", ""),
            city=preferences.get("city", "")
        )

    # STEP 2: run ranking only
    state = {
        "resume_text": resume_text,
        "profile": profile,
        "preferences": preferences,
        "jobs": jobs,
        "chat_history": []
    }

    result = workflow.invoke(state)

    # STEP 3: return ranked jobs ONLY (no resume yet)
    return {
        "jobs": result.get("ranked_jobs", [])
    }
