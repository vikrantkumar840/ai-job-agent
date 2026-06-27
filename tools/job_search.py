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

def search_jobs(role: str = "", city: str = ""):
    jobs = []

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

                # apply filters safely
                if role.lower() in j["title"].lower() or role == "":
                    if city.lower() in j["location"].lower() or city == "":
                        jobs.append(j)

    except Exception as e:
        print("RemoteOK error:", e)

    try:
        jobs += search_linkedin_jobs(role or "devops")
    except Exception as e:
        print("LinkedIn error:", e)

    jobs = [j for j in jobs if is_relevant(j)]

    return jobs[:10]
