from langgraph.graph import StateGraph, END

from workflows.state import JobState

from agents.ranking_agent import analyze_job
from agents.resume_agent import generate_resume
from agents.cover_letter_agent import generate_cover_letter


# =====================================================
# AI Ranking Agent
# =====================================================

def ranking_node(state):

    jobs = state.get("jobs", [])

    if not jobs:
        return {
            **state,
            "ranked_jobs": [],
            "selected_jobs": [],
        }

    analysis = analyze_job(
        {
            "jobs": jobs,
            "profile": state.get("profile", {}),
            "preferences": state.get("preferences", {}),
        }
    )

    ranked_jobs = analysis["ranked_jobs"]

    jobs_count = int(
        state.get("preferences", {}).get(
            "jobs_count",
            10,
        )
    )

    selected_jobs = ranked_jobs[:jobs_count]

    print("=" * 80)
    print(f"Selected {len(selected_jobs)} Jobs")
    print("=" * 80)

    return {
        **state,
        "ranked_jobs": ranked_jobs,
        "selected_jobs": selected_jobs,
    }


# =====================================================
# Resume Generator
# =====================================================

def resume_node(state):

    selected_jobs = state.get("selected_jobs", [])

    if not selected_jobs:
        return {
            **state,
            "resume": "",
        }

    resume = generate_resume(
        state["profile"],
        selected_jobs,
    )

    return {
        **state,
        "resume": resume,
    }


# =====================================================
# Cover Letter Generator
# =====================================================

def cover_node(state):

    selected_jobs = state.get("selected_jobs", [])

    if not selected_jobs:
        return {
            **state,
            "cover_letter": "",
        }

    cover_letter = generate_cover_letter(
        state["profile"],
        selected_jobs,
        state["resume"],
    )

    return {
        **state,
        "cover_letter": cover_letter,
    }


# =====================================================
# Workflow
# =====================================================

graph = StateGraph(JobState)

graph.add_node(
    "ranking",
    ranking_node,
)

graph.add_node(
    "resume",
    resume_node,
)

graph.add_node(
    "cover",
    cover_node,
)

graph.set_entry_point("ranking")

graph.add_edge(
    "ranking",
    "resume",
)

graph.add_edge(
    "resume",
    "cover",
)

graph.add_edge(
    "cover",
    END,
)

workflow = graph.compile()
