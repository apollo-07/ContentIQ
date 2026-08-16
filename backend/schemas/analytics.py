"""
schemas/analytics.py – Response schemas for all /analytics/* endpoints.
These shapes MUST match the API contract exactly so Developer 2's frontend works.
"""

from pydantic import BaseModel


# ── /analytics/overview ──────────────────────────────────────────────────────
class OverviewResponse(BaseModel):
    total_posts: int
    average_engagement_rate: float
    total_engagement: int
    best_content_type: str
    best_topic: str
    best_posting_time: str


# ── /analytics/content-types ─────────────────────────────────────────────────
class ContentTypeItem(BaseModel):
    content_type: str
    post_count: int
    average_engagement_rate: float
    median_engagement_rate: float


class ContentTypesResponse(BaseModel):
    data: list[ContentTypeItem]


# ── /analytics/topics ────────────────────────────────────────────────────────
class TopicItem(BaseModel):
    topic: str
    post_count: int
    average_engagement_rate: float
    median_engagement_rate: float


class TopicsResponse(BaseModel):
    data: list[TopicItem]


# ── /analytics/timing ────────────────────────────────────────────────────────
class DayItem(BaseModel):
    day: str
    average_engagement_rate: float


class HourItem(BaseModel):
    hour: int
    average_engagement_rate: float


class TimingResponse(BaseModel):
    day_data: list[DayItem]
    hour_data: list[HourItem]


# ── /analytics/trends ────────────────────────────────────────────────────────
class TrendPoint(BaseModel):
    date: str
    average_engagement_rate: float
    post_count: int


class TrendsResponse(BaseModel):
    data: list[TrendPoint]
