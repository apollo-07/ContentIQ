"""
schemas/insights.py – Response schemas for /insights and /recommendations
"""

from pydantic import BaseModel


# ── /insights ─────────────────────────────────────────────────────────────────
class InsightItem(BaseModel):
    id: int
    type: str          # content | timing | topic | engagement
    title: str
    description: str
    impact: str        # high | medium | low


class InsightsResponse(BaseModel):
    insights: list[InsightItem]


# ── /recommendations ──────────────────────────────────────────────────────────
class RecommendationItem(BaseModel):
    rank: int
    content_type: str
    topic: str
    day: str
    time_range: str
    score: float
    reasons: list[str]


class RecommendationsResponse(BaseModel):
    recommendations: list[RecommendationItem]
