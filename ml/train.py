"""
ml/train.py – Train Logistic Regression, Decision Tree, and Random Forest.
Picks the best model by F1 (macro) and saves it to ml/models/.

Run:
    python ml/train.py
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score

from ml.preprocessing import load_and_clean, get_features_and_target, FEATURE_COLS

MODEL_DIR = Path("ml/models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)


# ── Categorical columns to label-encode ──────────────────────────────────────
CAT_COLS = ["content_type", "topic", "day_of_week"]


def encode_categoricals(X_train: pd.DataFrame, X_test: pd.DataFrame):
    """Fit LabelEncoders on train set, transform both sets."""
    encoders = {}
    X_train = X_train.copy()
    X_test  = X_test.copy()

    for col in CAT_COLS:
        le = LabelEncoder()
        X_train[col] = le.fit_transform(X_train[col].astype(str))
        # Handle unseen labels in test set
        X_test[col] = X_test[col].apply(
            lambda v: le.transform([v])[0] if v in le.classes_ else -1
        )
        encoders[col] = le

    return X_train, X_test, encoders


def train_models(X_train, y_train):
    """Train all three classifiers and return them in a dict."""
    models = {
        "LogisticRegression": LogisticRegression(max_iter=500, random_state=42),
        "DecisionTree":       DecisionTreeClassifier(max_depth=10, random_state=42),
        "RandomForest":       RandomForestClassifier(n_estimators=100, random_state=42),
    }
    for name, model in models.items():
        print(f"  Training {name}...")
        model.fit(X_train, y_train)
    return models


def evaluate_models(models, X_test, y_test) -> dict:
    """Evaluate all models and return a results dict."""
    results = {}
    for name, model in models.items():
        y_pred = model.predict(X_test)
        report = classification_report(y_test, y_pred, output_dict=True)
        macro  = report.get("macro avg", {})
        results[name] = {
            "accuracy":  report.get("accuracy", 0),
            "precision": macro.get("precision", 0),
            "recall":    macro.get("recall", 0),
            "f1":        macro.get("f1-score", 0),
            "model":     model,
        }
        print(f"\n  [{name}]")
        print(classification_report(y_test, y_pred))
    return results


def main():
    print("\n[DATA] Loading and cleaning data...")
    df = load_and_clean()
    X, y = get_features_and_target(df)

    print(f"   Dataset: {len(df)} rows | Labels: {y.value_counts().to_dict()}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("\n[ENCODING] Encoding categoricals...")
    X_train_enc, X_test_enc, encoders = encode_categoricals(X_train, X_test)

    print("\n[TRAINING] Training models...")
    models = train_models(X_train_enc, y_train)

    print("\n[EVALUATION] Evaluating models...")
    results = evaluate_models(models, X_test_enc, y_test)

    # ── Pick best model by macro F1 ──────────────────────────────────────────
    best_name = max(results, key=lambda k: results[k]["f1"])
    best = results[best_name]
    print(f"\n[BEST MODEL] Best model: {best_name}  (F1={best['f1']:.4f})")

    # ── Save artifacts ────────────────────────────────────────────────────────
    model_path   = MODEL_DIR / "best_model.pkl"
    encoder_path = MODEL_DIR / "label_encoders.pkl"
    metrics_path = MODEL_DIR / "metrics.json"

    joblib.dump(best["model"], model_path)
    joblib.dump(encoders, encoder_path)

    # Save metrics for all models (for the model_runs table / docs)
    metrics_out = {
        name: {k: v for k, v in r.items() if k != "model"}
        for name, r in results.items()
    }
    metrics_out["best"] = best_name
    metrics_path.write_text(json.dumps(metrics_out, indent=2))

    print(f"\n[SUCCESS] Saved model     -> {model_path}")
    print(f"[SUCCESS] Saved encoders  -> {encoder_path}")
    print(f"[SUCCESS] Saved metrics   -> {metrics_path}")


if __name__ == "__main__":
    main()
