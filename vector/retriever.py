from vector.embedding import embedding_service
from vector.qdrant_store import qdrant_store


def search_jobs(
    query: str,
    session_id: str,
    limit: int = 5,
):
    """
    Semantic search within a single search session.
    """

    vector = embedding_service.embed_text(query)

    results = qdrant_store.search(
        vector=vector.tolist(),
        session_id=session_id,
        limit=limit,
    )

    jobs = []

    for result in results:
        jobs.append(result.payload)

    return jobs
