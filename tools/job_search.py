import requests

from browser.linkedin import search_linkedin_jobs

from vector.indexer import index_jobs
from vector.retriever import search_jobs as vector_search


KEYWORDS = [
    "devops",
    "devops engineer",
    "aws",
    "terraform",
    "docker",
    "kubernetes",
    "cloud",
    "sre",
]


def is_relevant(job):
    text = (
        job.get("title", "") +
        " " +
        job.get("description", "")
    ).lower()

    return any(k in text for k in KEYWORDS)


def search_jobs(role: str, city: str = ""):

    jobs = []

    # RemoteOK
    try:

        response = requests.get(
            "https://remoteok.com/api",
            timeout=10,
        )

        data = response.json()

        for item in data[1:]:

            job = {
                "title": item.get("position", ""),
                "company": item.get("company", ""),
                "description": item.get("description", ""),
                "location": item.get("location", "Remote"),
            }

            if is_relevant(job):
                jobs.append(job)

    except Exception as e:
        print("RemoteOK:", e)

    # LinkedIn
    try:
        jobs.extend(search_linkedin_jobs(role or "devops"))
    except Exception as e:
        print("LinkedIn:", e)

    jobs = jobs[:30]

    # Index all jobs into Qdrant
    index_jobs(jobs)

    # Perform semantic search
    query = f"{role} {city}".strip()

    return vector_search(query, limit=5)
