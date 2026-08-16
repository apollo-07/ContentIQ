"""
ml/predict.py – Standalone prediction helper (used by tests and CLI)

Usage:
    python ml/predict.py
"""

from pathlib import Path
import joblib
import numpy as np
import pandas as pd

MODEL_PATH   = Path("ml/models/best_model.pkl")
ENCODER_PATH = Path("ml/models/label_encoders.pkl")
CAT_COLS     = ["content_type", "topic", "day_of_week"]


def load_model_and_encoders():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run `python ml/train.py` first."
        )
    model    = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    return model, encoders


def predict(
    content_type: str,
    topic: str,
    day_of_week: str,
    posting_hour: int,
    caption_length: int,
    hashtag_count: int,
    followers: int,
) -> dict:
    """
    Return a dict with keys: prediction, probability, model.
    Avoids any engagement metric inputs to prevent target leakage.
    """
    model, encoders = load_model_and_encoders()

    row = pd.DataFrame([{
        "content_type": content_type,
        "topic":        topic,
        "day_of_week":  day_of_week,
        "posting_hour": posting_hour,
        "caption_length": caption_length,
        "hashtag_count":  hashtag_count,
        "followers":      followers,
    }])

    for col in CAT_COLS:
        le = encoders[col]
        val = row[col].iloc[0]
        row[col] = le.transform([val])[0] if val in le.classes_ else -1

    X = row[["content_type", "topic", "day_of_week",
             "posting_hour", "caption_length", "hashtag_count", "followers"]].values

    pred   = model.predict(X)[0]
    probas = model.predict_proba(X)[0]
    idx    = list(model.classes_).index(pred)
    prob   = round(float(probas[idx]), 4)

    return {
        "prediction":  pred,
        "probability": prob,
        "model":       type(model).__name__,
    }


if __name__ == "__main__":
    # Quick smoke-test
    result = predict(
        content_type="Reel",
        topic="Product",
        day_of_week="Saturday",
        posting_hour=20,
        caption_length=120,
        hashtag_count=5,
        followers=10000,
    )
    print(result)
