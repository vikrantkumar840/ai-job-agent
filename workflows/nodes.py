from tools.job_search import search_jobs
from database.search_session_store import init_search_sessions_table, save_search_session

init_search_sessions_table()


def search_node(state):
    preferences = state.get("preferences", {})

    role = preferences.get("role", "")
    city = preferences.get("location", "")
    experience = preferences.get("experience", "")
    websites = preferences.get("websites", ["LinkedIn", "RemoteOK"])

    result = search_jobs(
        role=role,
        city=city,
        websites=websites,
        experience=experience,
        limit=preferences.get("jobs_count", 20),
    )

    jobs = result["jobs"]
    session_id = result["session_id"]

    save_search_session(
        session_id=session_id,
        user_id=state.get("user_id"),
        role=role,
        city=city,
        experience=experience,
        websites=websites,
    )

    return {
        **state,
        "jobs": jobs,
        "session_id": session_id,
    }
