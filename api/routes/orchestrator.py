from fastapi import APIRouter
from workflows.graph import workflow
from tools.job_search import search_jobs

router = APIRouter(prefix="/orchestrator", tags=["Orchestrator"])


@router.post("/start")
def start_agent(payload: dict):

    resume_text = payload.get("resume_text")
    profile = payload.get("profile", {})
    preferences = payload.get("preferences", {})

    jobs = search_jobs(
        role=preferences.get("role", ""),
        city=preferences.get("city", "")
    )

    state = {
        "resume_text": resume_text,
        "profile": profile,
        "preferences": preferences,
        "jobs": jobs,
        "selected_jobs": [],
        "chat_history": []
    }

    result = workflow.invoke(state)

    print(result)

    return {
    "jobs": result.get("jobs", []),
    "ranked_jobs": result.get("ranked_jobs", []),
    "selected_jobs": result.get("selected_jobs", []),
    "resume": result.get("resume"),
    "cover_letter": result.get("cover_letter"),
}
