"""
routes/predict.py – POST /predict and POST /simulate
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.routes.deps import get_current_user
from backend.schemas.predict import PredictRequest, PredictResponse, SimulateRequest, SimulateResponse
from backend.services.prediction_service import predict_single, simulate_scenarios
from backend.models.prediction import Prediction

router = APIRouter(tags=["Prediction"])


@router.post("/predict", response_model=PredictResponse)
def predict(
    request: PredictRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Predict whether a social-media post will have LOW / MEDIUM / HIGH engagement.

    Input features must NOT include engagement metrics (likes, shares, etc.) to avoid
    target leakage. The model was pre-trained and is loaded from disk.
    """
    result = predict_single(request)

    # Persist prediction history
    record = Prediction(
        user_id=current_user.id,
        content_type=request.content_type,
        topic=request.topic,
        day_of_week=request.day_of_week,
        posting_hour=request.posting_hour,
        caption_length=request.caption_length,
        hashtag_count=request.hashtag_count,
        followers=request.followers,
        prediction=result.prediction,
        probability=result.probability,
        model_name=result.model,
    )
    db.add(record)
    db.commit()

    return result


@router.post("/simulate", response_model=SimulateResponse)
def simulate(
    request: SimulateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Batch-predict multiple posting scenarios at once.
    Returns a prediction and probability for each named scenario.
    """
    return simulate_scenarios(request)
