import requests
from browser.linkedin import search_linkedin_jobs

KEYWORDS = [
    "devops", "devops engineer",
    "cloud", "aws",
    "terraform", "kubernetes",
    "docker", "sre", "platform engineer"
]

def is_relevant(job):
    text = (job.get("title", "") + " " + job.get("description", "")).lower()
    return any(k in text for k in KEYWORDS)

def search_jobs():
    jobs = []

    # RemoteOK
    try:
        res = requests.get("https://remoteok.com/api", timeout=10)
        data = res.json()

        for job in data[1:20]:
            j = {
                "title": job.get("position", ""),
                "company": job.get("company", ""),
                "description": job.get("description", ""),
                "location": job.get("location", "Remote")
            }

            if is_relevant(j):
                jobs.append(j)

    except:
        pass

    # LinkedIn
    try:
        jobs += search_linkedin_jobs("devops OR cloud engineer OR aws")
    except:
        pass

    # FINAL HARD FILTER (IMPORTANT)
    jobs = [j for j in jobs if is_relevant(j)]

    return jobs[:5]
