import os
import time
import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from qdrant_client.http.exceptions import ResponseHandlingException


class QdrantStore:

    COLLECTION_NAME = "jobs"

    def __init__(self):
        # Read from environment variables, fallback to defaults
        host = os.getenv("QDRANT_HOST", "localhost")
        port = int(os.getenv("QDRANT_PORT", 6333))

        # Create client (but don't connect yet)
        self.client = QdrantClient(host=host, port=port)

        # Try to create collection with retries
        self._create_collection_with_retry()

    def _create_collection_with_retry(self, max_retries=10, delay=2):
        """Attempt to create the collection, retrying if Qdrant isn't ready."""
        for attempt in range(max_retries):
            try:
                self._create_collection()
                return  # success
            except (ResponseHandlingException, ConnectionError) as e:
                if attempt == max_retries - 1:
                    raise  # re-raise after final failure
                print(f"Qdrant not ready, retrying in {delay}s... (attempt {attempt+1}/{max_retries})")
                time.sleep(delay)

    # ----------------------------
    # CREATE COLLECTION
    # ----------------------------
    def _create_collection(self):
        collections = self.client.get_collections().collections
        names = [c.name for c in collections]

        if self.COLLECTION_NAME not in names:
            self.client.create_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=1024,
                    distance=Distance.COSINE,
                ),
            )

    # ----------------------------
    # INSERT
    # ----------------------------
    def insert(self, vector, payload):
        self.client.upsert(
            collection_name=self.COLLECTION_NAME,
            points=[
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload=payload,
                )
            ],
        )

    # ----------------------------
    # SEARCH
    # ----------------------------
    def search(self, vector, session_id: str, limit=5):
        response = self.client.query_points(
            collection_name=self.COLLECTION_NAME,
            query=vector,
            limit=limit,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="session_id",
                        match=MatchValue(value=session_id),
                    )
                ]
            ),
        )
        return response.points


# Module-level instance (now uses env vars and retries)
qdrant_store = QdrantStore()
