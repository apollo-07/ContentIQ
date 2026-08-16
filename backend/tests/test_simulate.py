"""
tests/test_simulate.py – Simulate endpoint tests
"""

import pytest
from unittest.mock import patch, MagicMock
import numpy as np
from fastapi.testclient import TestClient
from backend.tests.conftest import register_and_login, auth_headers
from backend.tests.test_predict import _mock_model, _mock_encoders

SCENARIO_A = {
    "name": "Scenario A",
    "content_type": "Reel",
    "topic": "Product",
    "day_of_week": "Saturday",
    "posting_hour": 20,
    "caption_length": 100,
    "hashtag_count": 5,
    "followers": 10000,
}

SCENARIO_B = {
    "name": "Scenario B",
    "content_type": "Image",
    "topic": "Educational",
    "day_of_week": "Monday",
    "posting_hour": 9,
    "caption_length": 50,
    "hashtag_count": 2,
    "followers": 5000,
}


@pytest.fixture
def mock_artifacts():
    with patch("backend.services.prediction_service._load_artifacts") as mock_load:
        mock_load.return_value = (_mock_model(), _mock_encoders())
        import backend.services.prediction_service as svc
        svc._model = None
        svc._encoders = None
        yield mock_load


def test_simulate_single_scenario(client, mock_artifacts):
    token = register_and_login(client)
    resp = client.post("/simulate", json={"scenarios": [SCENARIO_A]}, headers=auth_headers(token))
    assert resp.status_code == 200
    results = resp.json()["results"]
    assert len(results) == 1
    assert results[0]["name"] == "Scenario A"
    assert results[0]["prediction"] in ("LOW", "MEDIUM", "HIGH")
    assert 0.0 <= results[0]["probability"] <= 1.0


def test_simulate_multiple_scenarios(client, mock_artifacts):
    token = register_and_login(client)
    resp = client.post(
        "/simulate",
        json={"scenarios": [SCENARIO_A, SCENARIO_B]},
        headers=auth_headers(token),
    )
    assert resp.status_code == 200
    results = resp.json()["results"]
    assert len(results) == 2
    names = [r["name"] for r in results]
    assert "Scenario A" in names
    assert "Scenario B" in names


def test_simulate_empty_scenarios(client, mock_artifacts):
    token = register_and_login(client)
    resp = client.post("/simulate", json={"scenarios": []}, headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.json()["results"] == []


def test_simulate_no_auth(client, mock_artifacts):
    resp = client.post("/simulate", json={"scenarios": [SCENARIO_A]})
    assert resp.status_code in (401, 403)
