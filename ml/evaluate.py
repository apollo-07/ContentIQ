"""
ml/evaluate.py – Full model evaluation with confusion matrix and plots

Run:
    python ml/evaluate.py
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report, confusion_matrix,
    accuracy_score, precision_score, recall_score, f1_score,
)

from ml.preprocessing import load_and_clean, get_features_and_target
from ml.train import encode_categoricals

MODEL_PATH   = Path("ml/models/best_model.pkl")
ENCODER_PATH = Path("ml/models/label_encoders.pkl")
PLOT_DIR     = Path("data/processed")
PLOT_DIR.mkdir(parents=True, exist_ok=True)

LABELS = ["LOW", "MEDIUM", "HIGH"]


def evaluate():
    if not MODEL_PATH.exists():
        raise FileNotFoundError("Run `python ml/train.py` before evaluating.")

    model    = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)

    # Re-load the same data (deterministic split)
    from sklearn.model_selection import train_test_split
    df = load_and_clean()
    X, y = get_features_and_target(df)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    _, X_test_enc, _ = encode_categoricals(X_train, X_test)

    y_pred = model.predict(X_test_enc)

    # ── Text metrics ──────────────────────────────────────────────────────────
    print(f"\n{'='*50}")
    print(f"Model: {type(model).__name__}")
    print(f"{'='*50}")
    print(classification_report(y_test, y_pred, labels=LABELS, zero_division=0))

    metrics = {
        "accuracy":  round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, average="macro", zero_division=0), 4),
        "recall":    round(recall_score(y_test, y_pred, average="macro", zero_division=0), 4),
        "f1_macro":  round(f1_score(y_test, y_pred, average="macro", zero_division=0), 4),
    }
    print("Summary:", json.dumps(metrics, indent=2))

    # ── Confusion matrix plot ─────────────────────────────────────────────────
    cm = confusion_matrix(y_test, y_pred, labels=LABELS)
    plt.figure(figsize=(7, 5))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues",
        xticklabels=LABELS, yticklabels=LABELS,
    )
    plt.title(f"Confusion Matrix – {type(model).__name__}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()

    plot_path = PLOT_DIR / "confusion_matrix.png"
    plt.savefig(plot_path, dpi=150)
    plt.close()
    print(f"\n[SUCCESS] Confusion matrix saved -> {plot_path}")

    return metrics


if __name__ == "__main__":
    evaluate()
