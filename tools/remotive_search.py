import requests
from tools.time_utils import humanize_iso


def search_remotive_jobs(role: str, limit: int = 20) -> list[dict]:
    url = "https://remotive.com/api/remote-jobs"
    params = {"search": role} if role else {}

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    jobs = []
    for job in data.get("jobs", [])[:limit]:
        posted_at = job.get("publication_date")
        jobs.append({
            "title": job.get("title", ""),
            "company": job.get("company_name", "Unknown"),
            "location": job.get("candidate_required_location", "Remote"),
            "description": (job.get("description", "") or "")[:1000],
            "link": job.get("url"),
            "posted_at": posted_at,
            "posted_relative": humanize_iso(posted_at) if posted_at else "",
        })

    return jobs
