import os
import requests
from tools.time_utils import humanize_iso

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"


def search_adzuna_jobs(role: str, city: str = "", country: str = "in", limit: int = 20) -> list[dict]:
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        raise ValueError("ADZUNA_APP_ID / ADZUNA_APP_KEY not set in .env")

    url = f"{ADZUNA_BASE_URL}/{country}/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": role,
        "where": city,
        "results_per_page": limit,
        "content-type": "application/json",
    }

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    jobs = []
    for job in data.get("results", []):
        posted_at = job.get("created")
        jobs.append({
            "title": (job.get("title") or "").strip(),
            "company": (job.get("company") or {}).get("display_name", "Unknown"),
            "location": (job.get("location") or {}).get("display_name", ""),
            "description": (job.get("description") or "")[:1000],
            "link": job.get("redirect_url"),
            "posted_at": posted_at,
            "posted_relative": humanize_iso(posted_at),
        })
    return jobs
