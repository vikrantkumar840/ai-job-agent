from FlagEmbedding import FlagModel


class EmbeddingService:
    """
    Singleton embedding service using BAAI/bge-large-en-v1.5
    """

    def __init__(self):
        self.model = FlagModel(
            "BAAI/bge-large-en-v1.5",
            use_fp16=True
        )

    def embed_text(self, text: str):
        """
        Generate embedding for a single text.
        """
        return self.model.encode(text)

    def embed_batch(self, texts: list[str]):
        """
        Generate embeddings for multiple texts.
        """
        return self.model.encode(texts)


embedding_service = EmbeddingService()
