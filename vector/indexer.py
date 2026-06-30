from vector.embedding import embedding_service
from vector.qdrant_store import qdrant_store


def index_job(job_id: int, job: dict):
    """
    Index a single job into Qdrant.
    """

    text = f"""
    {job.get("title", "")}
    {job.get("company", "")}
    {job.get("description", "")}
    """

    vector = embedding_service.embed_text(text)

    qdrant_store.insert(
        job_id=job_id,
        vector=vector.tolist(),
        payload=job,
    )
    print(f"Indexing: {job.get('title')}")
    print("Inserted into Qdrant")

def index_jobs(jobs: list):
    """
    Index multiple jobs.
    """

    for idx, job in enumerate(jobs):
        index_job(idx, job)
