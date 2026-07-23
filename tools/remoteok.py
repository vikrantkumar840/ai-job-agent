import requests
from tools.time_utils import humanize_iso

def search_remoteok_jobs():
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; AIJobAgent/1.0; +https://example.com)"
    }
    res = requests.get("https://remoteok.com/api", headers=headers, timeout=10)
    res.raise_for_status()
    data = res.json()

    jobs = []
    for job in data[1:]:
        posted_at = job.get("date")
        jobs.append({
            "title": job.get("position", ""),
            "company": job.get("company", ""),
            "description": job.get("description", ""),
            "location": job.get("location") or "Remote",
            "link": job.get("url") or job.get("apply_url") or "",
            "posted_at": posted_at,
            "posted_relative": humanize_iso(posted_at),
        })
    return jobs
