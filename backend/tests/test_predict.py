"""
tests/test_predict.py – ML prediction endpoint tests

NOTE: These tests mock the model loading so no trained .pkl is required.
"""

import pytest
from unittest.mock import patch, MagicMock
import numpy as np
from fastapi.testclient import TestClient
from backend.tests.conftest import register_and_login, auth_headers

VALID_PAYLOAD = {
    "content_type": "Reel",
    "topic": "Product",
    "day_of_week": "Saturday",
    "posting_hour": 20,
    "caption_length": 120,
    "hashtag_count": 5,
    "followers": 10000,
}


def _mock_model():
    """Create a mock sklearn model that always predicts HIGH."""
    model = MagicMock()
    model.predict.return_value = np.array(["HIGH"])
    model.predict_proba.return_value = np.array([[0.05, 0.17, 0.78]])
    model.classes_ = ["HIGH", "LOW", "MEDIUM"]
    model.__class__.__name__ = "RandomForest"
    return model


def _mock_encoders():
    """Create mock LabelEncoders for categorical columns."""
    from sklearn.preprocessing import LabelEncoder

    def make_le(classes):
        le = LabelEncoder()
        le.fit(classes)
        return le

    return {
        "content_type": make_le(["Carousel", "Image", "Reel", "Story", "Video"]),
        "topic": make_le(["Behind the Scenes", "Educational", "Product", "Tutorial"]),
        "day_of_week": make_le(["Friday", "Monday", "Saturday", "Sunday", "Thursday", "Tuesday", "Wednesday"]),
    }


@pytest.fixture
def mock_artifacts(tmp_path):
    """Patch load_artifacts to return mock model and encoders."""
    with patch("backend.services.prediction_service._load_artifacts") as mock_load:
        mock_load.return_value = (_mock_model(), _mock_encoders())
        # Reset cached model
        import backend.services.prediction_service as svc
        svc._model = None
        svc._encoders = None
        yield mock_load


def test_predict_success(client, mock_artifacts):
    token = register_and_login(client)
    resp = client.post("/predict", json=VALID_PAYLOAD, headers=auth_headers(token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["prediction"] in ("LOW", "MEDIUM", "HIGH")
    assert 0.0 <= data["probability"] <= 1.0
    assert "model" in data
    assert isinstance(data["recommendations"], list)


def test_predict_response_fields(client, mock_artifacts):
    token = register_and_login(client)
    resp = client.post("/predict", json=VALID_PAYLOAD, headers=auth_headers(token))
    data = resp.json()
    assert set(data.keys()) == {"prediction", "probability", "model", "recommendations"}


def test_predict_missing_field(client, mock_artifacts):
    token = register_and_login(client)
    bad = {k: v for k, v in VALID_PAYLOAD.items() if k != "posting_hour"}
    resp = client.post("/predict", json=bad, headers=auth_headers(token))
    assert resp.status_code == 422


def test_predict_invalid_hour(client, mock_artifacts):
    token = register_and_login(client)
    payload = {**VALID_PAYLOAD, "posting_hour": 25}
    resp = client.post("/predict", json=payload, headers=auth_headers(token))
    assert resp.status_code == 422


def test_predict_no_auth(client, mock_artifacts):
    resp = client.post("/predict", json=VALID_PAYLOAD)
    assert resp.status_code in (401, 403)
