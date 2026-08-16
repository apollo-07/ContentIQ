"""
routes/insights.py – GET /insights and GET /recommendations
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.routes.deps import get_current_user
from backend.schemas.insights import InsightsResponse, RecommendationsResponse
from backend.services.insight_service import get_insights
from backend.services.recommendation_service import get_recommendations

router = APIRouter(tags=["Insights"])


@router.get("/insights", response_model=InsightsResponse)
def insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Auto-generated insights derived from your historical post data.
    Each insight includes a type, title, description, and impact level.
    """
    return get_insights(db, current_user.id)


@router.get("/recommendations", response_model=RecommendationsResponse)
def recommendations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Top posting recommendations ranked by predicted engagement score (0–100).
    Based on rule/stats analysis of historical data.
    """
    return get_recommendations(db, current_user.id)
