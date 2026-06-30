from tools.job_search import search_jobs

def search_node(state):

    preferences = state.get("preferences", {})

    jobs = search_jobs(
        role=preferences.get("role", ""),
        city=preferences.get("city", "")
    )

    return {
        **state,
        "jobs": jobs
    }
