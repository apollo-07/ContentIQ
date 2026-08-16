"""
routes/analytics.py – All /analytics/* endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.routes.deps import get_current_user
from backend.schemas.analytics import (
    OverviewResponse, ContentTypesResponse, TopicsResponse,
    TimingResponse, TrendsResponse,
)
from backend.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=OverviewResponse)
def overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """High-level summary: total posts, avg engagement rate, best content type/topic/time."""
    return analytics_service.get_overview(db, current_user.id)


@router.get("/content-types", response_model=ContentTypesResponse)
def content_types(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Engagement breakdown by content type (Reel, Image, Story, etc.)."""
    return analytics_service.get_content_types(db, current_user.id)


@router.get("/topics", response_model=TopicsResponse)
def topics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Engagement breakdown by post topic."""
    return analytics_service.get_topics(db, current_user.id)


@router.get("/timing", response_model=TimingResponse)
def timing(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Average engagement by day of week and posting hour."""
    return analytics_service.get_timing(db, current_user.id)


@router.get("/trends", response_model=TrendsResponse)
def trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Weekly engagement trend over time."""
    return analytics_service.get_trends(db, current_user.id)
