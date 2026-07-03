from fastapi import APIRouter
from workflows.graph import workflow
from tools.job_search import search_jobs

from agents.profile_agent import extract_profile
router = APIRouter(prefix="/orchestrator", tags=["Orchestrator"])


@router.post("/start")
def start_agent(payload: dict):
    print("=" * 80)
    print("PAYLOAD RECEIVED")
    print(payload.keys())
    resume_text = payload.get("resume_text", "")


    print("Resume Length:", len(resume_text))
    print(resume_text[:300])
    print("=" * 80)

    resume_text = payload.get("resume_text", "")

    profile = extract_profile(resume_text)
    preferences = payload.get("preferences", {})

    role = preferences.get("department", "").strip()

    if not role:
        role = profile.get("career_role", "")

    jobs = search_jobs(

        role=role,
        city=preferences.get("location", ""),
        website=preferences.get("website", "LinkedIn"),
        experience=preferences.get("experience", ""),
        limit=preferences.get("jobs_count", 10),
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
