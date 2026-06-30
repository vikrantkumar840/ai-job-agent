from vector.embedding import embedding_service
from vector.qdrant_store import qdrant_store


def search_jobs(query: str, limit: int = 5):
    """
    Semantic search over indexed jobs.
    """

    vector = embedding_service.embed_text(query)

    results = qdrant_store.search(
        vector.tolist(),
        limit=limit,
    )

    jobs = []

    for result in results:
        jobs.append(result.payload)

    return jobs
