"""
routes/strategy.py – GET /strategy
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.routes.deps import get_current_user
from backend.schemas.strategy import StrategyResponse
from backend.services.strategy_service import get_strategy

router = APIRouter(tags=["Strategy"])


@router.get("/strategy", response_model=StrategyResponse)
def strategy(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns a 7-day (Mon–Sun) content strategy calendar.
    Each day includes the recommended content type, topic, posting time window,
    and an engagement score (0–100).
    """
    return get_strategy(db, current_user.id)
