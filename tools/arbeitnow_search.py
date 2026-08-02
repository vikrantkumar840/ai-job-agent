import requests
from tools.time_utils import humanize_iso
from datetime import datetime, timezone


def search_arbeitnow_jobs(role: str, city: str = "", limit: int = 20) -> list[dict]:
    url = "https://www.arbeitnow.com/api/job-board-api"
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    data = response.json()

    role_lower = (role or "").lower()
    city_lower = (city or "").lower()

    jobs = []
    for job in data.get("data", []):
        title = job.get("title", "")
        description = job.get("description", "")
        location = job.get("location", "") or ("Remote" if job.get("remote") else "")

        haystack = f"{title} {description}".lower()
        if role_lower and role_lower not in haystack:
            continue
        if city_lower and city_lower not in location.lower() and not job.get("remote"):
            continue

        created_at = job.get("created_at")
        posted_at = None
        if created_at:
            posted_at = datetime.fromtimestamp(created_at, tz=timezone.utc).isoformat()

        jobs.append({
            "title": title,
            "company": job.get("company_name", "Unknown"),
            "location": location,
            "description": description[:1000],
            "link": job.get("url"),
            "posted_at": posted_at,
            "posted_relative": humanize_iso(posted_at) if posted_at else "",
        })

        if len(jobs) >= limit:
            break

    return jobs
