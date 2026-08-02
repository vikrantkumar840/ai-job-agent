import requests
from tools.time_utils import humanize_iso

def search_remoteok_jobs(role: str = "", limit: int = 30):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; AIJobAgent/1.0; +https://example.com)"
    }
    res = requests.get("https://remoteok.com/api", headers=headers, timeout=10)
    res.raise_for_status()
    data = res.json()

    role_lower = (role or "").lower()

    jobs = []
    for job in data[1:]:
        title = job.get("position", "")
        description = job.get("description", "") or ""

        if role_lower:
            haystack = f"{title} {description}".lower()
            tags = " ".join(job.get("tags", []) or []).lower()
            if role_lower not in haystack and role_lower not in tags:
                continue

        posted_at = job.get("date")
        jobs.append({
            "title": title,
            "company": job.get("company", ""),
            "description": description,
            "location": job.get("location") or "Remote",
            "link": job.get("url") or job.get("apply_url") or "",
            "posted_at": posted_at,
            "posted_relative": humanize_iso(posted_at) if posted_at else "",
        })

        if len(jobs) >= limit:
            break

    return jobs
