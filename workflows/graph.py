from langgraph.graph import StateGraph, END
from workflows.state import JobState

from agents.resume_agent import generate_resume
from agents.cover_letter_agent import generate_cover_letter
from vector.retriever import search_jobs as vector_search

# ----------------------------
# RANK NODE
# ----------------------------
def rank_jobs_node(state):

    profile = state.get("profile", {})
    resume_text = state.get("resume_text", "")

    summary = profile.get("summary", "")
    skills = profile.get("skills", [])

    query = f"{summary} {' '.join(skills)}"

    # Fallback if profile is empty
    if not query.strip():
        query = resume_text

    print("=" * 80)
    print("Vector Search Query:")
    print(query)
    print("=" * 80)

    ranked = vector_search(query)

    return {
        **state,
        "ranked_jobs": ranked,
        "selected_jobs": ranked[:3],
    }
# ----------------------------
# RESUME NODE
# ----------------------------
def resume_node(state):

    profile = state.get("profile", {})
    selected_jobs = state.get("selected_jobs", [])

    if not selected_jobs:
        return {"resume": {"error": "No ranked jobs available"}}

    resume = generate_resume(profile, selected_jobs)

    return {
        **state,
        "resume": resume
    }


# ----------------------------
# COVER LETTER NODE
# ----------------------------
def cover_node(state):

    profile = state.get("profile", {})
    selected_jobs = state.get("selected_jobs", [])
    resume = state.get("resume", "")

    if not selected_jobs:
        return {"cover_letter": {"error": "No ranked jobs available"}}

    letter = generate_cover_letter(profile, selected_jobs, resume)

    return {
        **state,
        "cover_letter": letter
    }


# ----------------------------
# BUILD GRAPH
# ----------------------------
graph = StateGraph(JobState)

graph.add_node("rank_jobs", rank_jobs_node)
graph.add_node("resume", resume_node)
graph.add_node("cover", cover_node)

graph.set_entry_point("rank_jobs")

graph.add_edge("rank_jobs", "resume")
graph.add_edge("resume", "cover")
graph.add_edge("cover", END)

workflow = graph.compile()
