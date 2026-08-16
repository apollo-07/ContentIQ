"""
services/prediction_service.py – Load saved ML model and run predictions
"""

import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import HTTPException

from backend.schemas.predict import PredictRequest, PredictResponse, SimulateRequest, SimulateResponse, ScenarioResult

MODEL_PATH = Path("ml/models/best_model.pkl")
ENCODER_PATH = Path("ml/models/label_encoders.pkl")

# Cache the loaded model so we don't reload on every request
_model = None
_encoders = None


def _load_artifacts():
    global _model, _encoders
    if _model is None:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=503,
                detail="ML model not trained yet. Run `python ml/train.py` first.",
            )
        _model = joblib.load(MODEL_PATH)
        _encoders = joblib.load(ENCODER_PATH)
    return _model, _encoders


def _build_feature_df(data: dict) -> pd.DataFrame:
    """Convert raw request dict into a single-row DataFrame."""
    return pd.DataFrame([{
        "content_type": data["content_type"],
        "topic": data["topic"],
        "day_of_week": data["day_of_week"],
        "posting_hour": data["posting_hour"],
        "caption_length": data["caption_length"],
        "hashtag_count": data["hashtag_count"],
        "followers": data["followers"],
    }])


def _encode_features(df: pd.DataFrame, encoders: dict) -> np.ndarray:
    """Encode categorical columns using saved LabelEncoders and return feature matrix."""
    cat_cols = ["content_type", "topic", "day_of_week"]
    for col in cat_cols:
        le = encoders.get(col)
        if le is None:
            raise HTTPException(status_code=500, detail=f"Missing encoder for column: {col}")
        # Handle unseen labels gracefully
        df[col] = df[col].apply(
            lambda v: le.transform([v])[0] if v in le.classes_ else -1
        )
    return df[["content_type", "topic", "day_of_week", "posting_hour",
               "caption_length", "hashtag_count", "followers"]].values


def _generate_recs(prediction: str, data: dict) -> list[str]:
    """Rule-based post-prediction recommendations."""
    recs = []
    if prediction != "HIGH":
        if data["posting_hour"] < 17 or data["posting_hour"] > 22:
            recs.append("Consider posting between 17:00 and 22:00 for higher engagement.")
        if data["hashtag_count"] < 3:
            recs.append("Try using 5–10 hashtags to increase reach.")
        if data["caption_length"] < 50:
            recs.append("Longer captions (100–200 characters) tend to drive more engagement.")
    if prediction == "HIGH":
        recs.append("Your post configuration looks great — go ahead and publish!")
    return recs if recs else ["Your settings look good. Test with a small audience first."]


def predict_single(request: PredictRequest) -> PredictResponse:
    model, encoders = _load_artifacts()
    df = _build_feature_df(request.model_dump())
    X = _encode_features(df.copy(), encoders)

    pred_label = model.predict(X)[0]                        # LOW / MEDIUM / HIGH
    proba = model.predict_proba(X)[0]
    class_idx = list(model.classes_).index(pred_label)
    probability = round(float(proba[class_idx]), 4)

    model_name = type(model).__name__
    recs = _generate_recs(pred_label, request.model_dump())

    return PredictResponse(
        prediction=str(pred_label),
        probability=probability,
        model=model_name,
        recommendations=recs,
    )


def simulate_scenarios(request: SimulateRequest) -> SimulateResponse:
    model, encoders = _load_artifacts()
    results = []
    for scenario in request.scenarios:
        df = _build_feature_df(scenario.model_dump())
        X = _encode_features(df.copy(), encoders)
        pred_label = model.predict(X)[0]
        proba = model.predict_proba(X)[0]
        class_idx = list(model.classes_).index(pred_label)
        probability = round(float(proba[class_idx]), 4)
        results.append(ScenarioResult(
            name=scenario.name,
            prediction=str(pred_label),
            probability=probability,
        ))
    return SimulateResponse(results=results)
