import requests


def search_remoteok_jobs():
    res = requests.get("https://remoteok.com/api")
    data = res.json()

    jobs = []

    for job in data[1:5]:
        jobs.append({
            "title": job.get("position", ""),
            "company": job.get("company", ""),
            "description": job.get("description", ""),
            "location": job.get("location", "Remote")
        })

    return jobs
