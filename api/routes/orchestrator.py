from fastapi import APIRouter
import time

from workflows.graph import workflow
from tools.job_search import search_jobs
from agents.profile_agent import extract_profile
from services.resume_version_service import save_resume_version

from services.session_service import (
    save_resume,
    save_session,
    save_cover_letter,
    save_ai_output,
)

router = APIRouter(
    prefix="/orchestrator",
    tags=["Orchestrator"],
)


@router.post("/start")
def start_agent(payload: dict):

    total_start = time.perf_counter()

    print("=" * 80)
    print("PAYLOAD RECEIVED")
    print(payload.keys())

    resume_text = payload.get("resume_text", "")

    print("Resume Length:", len(resume_text))
    print(resume_text[:300])
    print("=" * 80)

    user_id = payload.get("user_id")

    # ============================================================
    # Profile Extraction
    # ============================================================

    t = time.perf_counter()

    profile = extract_profile(resume_text)

    print(f"✅ Profile Extraction : {time.perf_counter() - t:.2f} sec")

    preferences = payload.get("preferences", {})

    role = preferences.get("department", "").strip()

    if not role:
        role = profile.get("career_role", "").strip()

    # ============================================================
    # Job Search
    # ============================================================

    t = time.perf_counter()

    job_result = search_jobs(
        role=role,
        city=preferences.get("location", ""),
        website=preferences.get("website", "LinkedIn"),
        experience=preferences.get("experience", ""),
        limit=preferences.get("jobs_count", 10),
    )

    print(f"✅ Job Search        : {time.perf_counter() - t:.2f} sec")

    jobs = job_result["jobs"]
    session_id = job_result["session_id"]

    state = {
        "resume_text": resume_text,
        "profile": profile,
        "preferences": preferences,
        "jobs": jobs,
        "selected_jobs": [],
        "chat_history": [],
        "session_id": session_id,
    }

    # ============================================================
    # AI Workflow
    # ============================================================

    t = time.perf_counter()

    result = workflow.invoke(state)

    print(f"✅ AI Workflow      : {time.perf_counter() - t:.2f} sec")

    # ============================================================
    # Database Save
    # ============================================================

    t = time.perf_counter()

    save_resume(
        user_id=user_id,
        resume_text=resume_text,
        profile=profile,
    )

    save_session(
        user_id=user_id,
        session_id=session_id,
        jobs=result.get("jobs", []),
        ranked_jobs=result.get("ranked_jobs", []),
        selected_jobs=result.get("selected_jobs", []),
    )

    save_cover_letter(
        user_id=user_id,
        session_id=session_id,
        cover_letter=result.get("cover_letter"),
    )

    save_ai_output(
        user_id=user_id,
        session_id=session_id,
        resume=result.get("resume"),
        cover_letter=result.get("cover_letter"),
    )

    save_resume_version(
        user_id=user_id,
        session_id=session_id,
        resume=result.get("resume"),
    )

    print(f"✅ Database Save    : {time.perf_counter() - t:.2f} sec")

    print("=" * 80)
    print("SESSION SAVED:", session_id)
    print("=" * 80)

    print("🚀 PERFORMANCE SUMMARY")
    print(f"Total Execution Time : {time.perf_counter() - total_start:.2f} sec")
    print("=" * 80)

    return {
        "user_id": user_id,
        "session_id": session_id,
        "jobs": result.get("jobs", []),
        "ranked_jobs": result.get("ranked_jobs", []),
        "selected_jobs": result.get("selected_jobs", []),
        "resume": result.get("resume"),
        "cover_letter": result.get("cover_letter"),
    }
