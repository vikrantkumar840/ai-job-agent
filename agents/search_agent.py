from tools.job_search import search_jobs

def search_node(state):

    preferences = state.get("preferences", {})

    jobs = search_jobs(
        role=preferences.get("role", ""),
        city=preferences.get("location", ""),
        website=preferences.get("website",["LinkedIn", "RemoteOK"]),
        limit=preferences.get("jobs_count", 20),    )

    return {
        **state,
        "jobs": jobs
    }
