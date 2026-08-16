"""
tests/test_datasets.py – Dataset upload and validation tests
"""

import io
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from backend.tests.conftest import register_and_login, auth_headers


def _make_csv(rows: list[dict]) -> bytes:
    df = pd.DataFrame(rows)
    buf = io.BytesIO()
    df.to_csv(buf, index=False)
    return buf.getvalue()


VALID_ROW = {
    "post_id": "P001", "date": "2024-01-15", "content_type": "Reel",
    "topic": "Product", "posting_time": "19:00", "day_of_week": "Monday",
    "caption_length": 120, "hashtag_count": 5, "followers": 10000,
    "impressions": 5000, "reach": 4000, "views": 3000,
    "likes": 200, "comments": 30, "shares": 20, "saves": 15,
}


def test_upload_valid_csv(client: TestClient):
    token = register_and_login(client)
    rows = [{**VALID_ROW, "post_id": f"P00{i}"} for i in range(10)]
    csv_bytes = _make_csv(rows)
    resp = client.post(
        "/datasets/upload",
        files={"file": ("posts.csv", csv_bytes, "text/csv")},
        data={"name": "Test Dataset", "description": "Unit test upload"},
        headers=auth_headers(token),
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Test Dataset"
    assert data["status"] == "ready"
    assert data["row_count"] == 10


def test_upload_missing_column(client: TestClient):
    token = register_and_login(client)
    bad_row = {k: v for k, v in VALID_ROW.items() if k != "reach"}
    csv_bytes = _make_csv([bad_row])
    resp = client.post(
        "/datasets/upload",
        files={"file": ("bad.csv", csv_bytes, "text/csv")},
        data={"name": "Bad Dataset"},
        headers=auth_headers(token),
    )
    assert resp.status_code == 400
    assert "Missing columns" in resp.json()["detail"]


def test_list_datasets_empty(client: TestClient):
    token = register_and_login(client)
    resp = client.get("/datasets", headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.json()["datasets"] == []


def test_list_datasets_after_upload(client: TestClient):
    token = register_and_login(client)
    csv_bytes = _make_csv([VALID_ROW] * 5)
    client.post(
        "/datasets/upload",
        files={"file": ("posts.csv", csv_bytes, "text/csv")},
        data={"name": "DS1"},
        headers=auth_headers(token),
    )
    resp = client.get("/datasets", headers=auth_headers(token))
    assert resp.status_code == 200
    assert len(resp.json()["datasets"]) == 1


def test_get_dataset_by_id(client: TestClient):
    token = register_and_login(client)
    csv_bytes = _make_csv([VALID_ROW])
    upload = client.post(
        "/datasets/upload",
        files={"file": ("posts.csv", csv_bytes, "text/csv")},
        data={"name": "DS2"},
        headers=auth_headers(token),
    )
    ds_id = upload.json()["id"]
    resp = client.get(f"/datasets/{ds_id}", headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.json()["id"] == ds_id


def test_get_nonexistent_dataset(client: TestClient):
    token = register_and_login(client)
    resp = client.get("/datasets/99999", headers=auth_headers(token))
    assert resp.status_code == 404


def test_engagement_rate_calculation():
    """Unit test for the engagement_rate formula."""
    from backend.services.dataset_service import _compute_engagement_rate
    df = pd.DataFrame([{
        "likes": 200, "comments": 30, "shares": 20, "saves": 15, "reach": 4000,
    }])
    rate = _compute_engagement_rate(df).iloc[0]
    expected = (200 + 30 + 20 + 15) / 4000 * 100
    assert abs(rate - expected) < 0.01
