from vector.embedding import embedding_service
from vector.qdrant_store import qdrant_store


def search_jobs(
    query: str,
    session_id: str,
    limit: int = 20,
):
    """
    Perform semantic retrieval for a specific search session.
    Returns the most relevant jobs stored in Qdrant.
    """

    print("=" * 80)
    print("VECTOR SEARCH")
    print("Session :", session_id)
    print("Limit   :", limit)
    print("=" * 80)

    embedding = embedding_service.embed_text(query)

    results = qdrant_store.search(
        vector=embedding.tolist(),
        session_id=session_id,
        limit=limit,
    )

    jobs = []

    for result in results:

        job = result.payload

        job["vector_score"] = result.score

        jobs.append(job)

    print(f"Retrieved {len(jobs)} Jobs")

    return jobs
