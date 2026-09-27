import json
import logging
import math
from typing import List, Optional
import httpx

from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.evidence import Evidence
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# Embedding dimension for text-embedding-ada-002. Kept as a constant so the
# zero-vector fallback and downstream similarity math agree on dimensionality.
EMBEDDING_DIM = 1536
EMBEDDING_MODEL = "text-embedding-ada-002"


class VectorSearchService:
    """Semantic evidence retrieval.

    Uses OpenAI embeddings stored as JSON-serialized vectors on the Evidence
    row (see models/evidence.py `embedding` column). Similarity is computed in
    the application layer (cosine) so this works on both the SQLite MVP and
    PostgreSQL without requiring the pgvector extension. Migrating to a native
    pgvector index is a follow-up optimization.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self._client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
            http_client=httpx.AsyncClient(),
        )

    @staticmethod
    def _is_key_configured() -> bool:
        key = (settings.OPENAI_API_KEY or "").strip()
        return bool(key) and "mock" not in key.lower()

    async def get_embedding(self, text_input: str) -> List[float]:
        """Return the embedding for `text_input`.

        Falls back to a zero vector when no real OpenAI key is configured so
        the rest of the pipeline can still run structurally (the caller is
        expected to degrade to keyword search in that case).
        """
        if not self._is_key_configured():
            return [0.0] * EMBEDDING_DIM

        try:
            response = await self._client.embeddings.create(
                input=text_input,
                model=EMBEDDING_MODEL,
            )
            return response.data[0].embedding
        except Exception as e:
            logger.warning("[VectorSearch] embedding request failed: %s", e)
            return [0.0] * EMBEDDING_DIM

    @staticmethod
    def _cosine_similarity(a: List[float], b: List[float]) -> float:
        if len(a) != len(b):
            return -1.0
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        if norm_a == 0 or norm_b == 0:
            return -1.0
        return dot / (norm_a * norm_b)

    @staticmethod
    def _deserialize_embedding(raw: Optional[str]) -> List[float]:
        if not raw:
            return []
        try:
            vec = json.loads(raw)
            if isinstance(vec, list):
                return vec
        except (json.JSONDecodeError, TypeError):
            pass
        return []

    async def search_evidence(self, query: str, limit: int = 5) -> List[Evidence]:
        """Return the top-`limit` evidence most similar to `query`.

        Strategy:
          1. Compute the query embedding.
          2. Load all evidence rows that have a non-empty embedding.
          3. Rank by cosine similarity, return top-k.
          4. If no embeddings exist OR the query embedding is all zeros (no API
             key), fall back to keyword OR search so the system still works.
             Each keyword generates a set of OR conditions (title/summary/keywords);
             rows are ranked by how many keywords they match so the most relevant
             results still surface first.
        """
        query_embedding = await self.get_embedding(query)
        query_is_zero = all(v == 0.0 for v in query_embedding)

        # Only attempt semantic search when we actually have a query vector
        if not query_is_zero:
            stmt = select(Evidence).where(Evidence.embedding.isnot(None))
            result = await self.db.execute(stmt)
            rows = result.scalars().all()

            scored = []
            for ev in rows:
                vec = self._deserialize_embedding(ev.embedding)
                if not vec:
                    continue
                score = self._cosine_similarity(query_embedding, vec)
                if score >= 0:
                    scored.append((score, ev))

            if scored:
                scored.sort(key=lambda x: x[0], reverse=True)
                return [ev for _, ev in scored[:limit]]

        # Fallback: keyword OR search across title / summary / keywords.
        # Each word is treated as an independent OR-condition so that a query
        # like "stage IIA STAS lung adenocarcinoma" still finds rows that match
        # ANY of those terms — previously all terms were AND-chained which
        # almost always returned 0 results (BUG-009).
        logger.info("[VectorSearch] no usable embeddings, falling back to keyword search")
        words = [w.strip() for w in query.split() if len(w.strip()) >= 3]

        if not words:
            # Empty query or all short tokens — return all evidence up to limit
            stmt = select(Evidence).limit(limit)
            result = await self.db.execute(stmt)
            return result.scalars().all()

        # Build one giant OR across all (word, field) combinations
        per_word_conditions = []
        for w in words:
            per_word_conditions.append(
                or_(
                    Evidence.keywords.ilike(f"%{w}%"),
                    Evidence.title.ilike(f"%{w}%"),
                    Evidence.summary.ilike(f"%{w}%"),
                )
            )

        # Fetch all rows matching ANY keyword
        stmt = select(Evidence).where(or_(*per_word_conditions)).limit(limit * 4)
        result = await self.db.execute(stmt)
        rows = result.scalars().all()

        if not rows:
            # Last resort: return most recent evidence
            stmt = select(Evidence).order_by(Evidence.year.desc()).limit(limit)
            result = await self.db.execute(stmt)
            return result.scalars().all()

        # Rank rows by number of matching keywords (higher = more relevant)
        def count_matches(ev: Evidence) -> int:
            combined = " ".join(filter(None, [ev.title or "", ev.summary or "", ev.keywords or ""])).lower()
            return sum(1 for w in words if w.lower() in combined)

        rows_ranked = sorted(rows, key=count_matches, reverse=True)
        return rows_ranked[:limit]
