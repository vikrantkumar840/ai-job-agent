from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
)


class QdrantStore:

    COLLECTION_NAME = "jobs"

    def __init__(self):

        self.client = QdrantClient(
            host="localhost",
            port=6333,
        )

        self._create_collection()

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
    def insert(self, job_id, vector, payload):

        self.client.upsert(
            collection_name=self.COLLECTION_NAME,
            points=[
                PointStruct(
                    id=job_id,
                    vector=vector,
                    payload=payload,
                )
            ],
        )

    # ----------------------------
    # SEARCH
    # ----------------------------
    def search(self, vector, limit=5):

        response = self.client.query_points(
            collection_name=self.COLLECTION_NAME,
            query=vector,
            limit=limit,
        )

        return response.points


qdrant_store = QdrantStore()
