from langgraph.graph import StateGraph, END
from workflows.state import JobState

from agents.resume_agent import generate_resume
from agents.cover_letter_agent import generate_cover_letter
from vector.retriever import search_jobs as vector_search


# =====================================================
# Rank Jobs
# =====================================================

def rank_jobs_node(state):

    profile = state.get("profile", {})
    resume_text = state.get("resume_text", "")
    preferences = state.get("preferences", {})

    summary = profile.get("summary", "")
    skills = profile.get("skills", [])

    department = preferences.get("department", "")
    location = preferences.get("location", "")
    experience = preferences.get("experience", "")
    website = preferences.get("website", "")
    jobs_count = int(preferences.get("jobs_count", 10))

    query = f"""
Department:
{department}

Preferred Location:
{location}

Experience:
{experience}

Preferred Website:
{website}

Professional Summary:
{summary}

Skills:
{' '.join(skills)}

Resume:
{resume_text}
""".strip()

    print("=" * 80)
    print("VECTOR SEARCH QUERY")
    print(query)
    print("=" * 80)

    session_id = state["session_id"]

    ranked_jobs = vector_search(
        query=query,
        session_id=session_id,
        limit=jobs_count,
    )
    print("=" * 80)
    print(f"Top {len(ranked_jobs)} Ranked Jobs")
    print("=" * 80)

    for index, job in enumerate(ranked_jobs, start=1):
        print(
            f"{index}. "
            f"{job.get('title')} | "
            f"{job.get('company')} | "
            f"{job.get('location')}"
        )

    print("=" * 80)

    return {
        **state,
        "ranked_jobs": ranked_jobs,
        "selected_jobs": ranked_jobs
    }


# =====================================================
# Resume Generator
# =====================================================

def resume_node(state):

    profile = state.get("profile", {})
    selected_jobs = state.get("selected_jobs", [])

    if len(selected_jobs) == 0:
        return {
            **state,
            "resume": {
                "error": "No jobs available."
            }
        }

    resume = generate_resume(
        profile,
        selected_jobs
    )

    return {
        **state,
        "resume": resume
    }


# =====================================================
# Cover Letter Generator
# =====================================================

def cover_node(state):

    profile = state.get("profile", {})
    selected_jobs = state.get("selected_jobs", [])
    resume = state.get("resume", {})

    if len(selected_jobs) == 0:
        return {
            **state,
            "cover_letter": {
                "error": "No jobs available."
            }
        }

    cover_letter = generate_cover_letter(
        profile,
        selected_jobs,
        resume
    )

    return {
        **state,
        "cover_letter": cover_letter
    }


# =====================================================
# LangGraph
# =====================================================

graph = StateGraph(JobState)

graph.add_node("rank_jobs", rank_jobs_node)
graph.add_node("resume", resume_node)
graph.add_node("cover", cover_node)

graph.set_entry_point("rank_jobs")

graph.add_edge("rank_jobs", "resume")
graph.add_edge("resume", "cover")
graph.add_edge("cover", END)

workflow = graph.compile()
