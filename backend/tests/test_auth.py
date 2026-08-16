"""
tests/test_auth.py – Authentication endpoint tests
"""

import pytest
from fastapi.testclient import TestClient
from backend.tests.conftest import auth_headers, register_and_login


def test_register_success(client: TestClient):
    resp = client.post("/auth/register", json={
        "username": "alice",
        "email": "alice@example.com",
        "password": "secure123",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "alice@example.com"
    assert data["username"] == "alice"
    assert "id" in data


def test_register_duplicate_email(client: TestClient):
    payload = {"username": "user1", "email": "dup@example.com", "password": "pass123"}
    client.post("/auth/register", json=payload)
    resp = client.post("/auth/register", json={"username": "user2", "email": "dup@example.com", "password": "pass123"})
    assert resp.status_code == 400
    assert "Email already registered" in resp.json()["detail"]


def test_register_duplicate_username(client: TestClient):
    client.post("/auth/register", json={"username": "taken", "email": "a@example.com", "password": "pass123"})
    resp = client.post("/auth/register", json={"username": "taken", "email": "b@example.com", "password": "pass123"})
    assert resp.status_code == 400
    assert "Username already taken" in resp.json()["detail"]


def test_register_short_password(client: TestClient):
    resp = client.post("/auth/register", json={
        "username": "bob", "email": "bob@example.com", "password": "123",
    })
    assert resp.status_code == 422  # Pydantic validation error


def test_login_success(client: TestClient):
    client.post("/auth/register", json={
        "username": "carol", "email": "carol@example.com", "password": "mypassword",
    })
    resp = client.post("/auth/login", json={"email": "carol@example.com", "password": "mypassword"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient):
    client.post("/auth/register", json={
        "username": "dave", "email": "dave@example.com", "password": "correctpass",
    })
    resp = client.post("/auth/login", json={"email": "dave@example.com", "password": "wrongpass"})
    assert resp.status_code == 401


def test_login_unknown_email(client: TestClient):
    resp = client.post("/auth/login", json={"email": "ghost@example.com", "password": "pass123"})
    assert resp.status_code == 401


def test_protected_endpoint_without_token(client: TestClient):
    resp = client.get("/analytics/overview")
    assert resp.status_code in (401, 403)


def test_protected_endpoint_with_valid_token(client: TestClient):
    token = register_and_login(client)
    resp = client.get("/analytics/overview", headers=auth_headers(token))
    assert resp.status_code == 200


def test_protected_endpoint_with_invalid_token(client: TestClient):
    resp = client.get("/analytics/overview", headers={"Authorization": "Bearer not.a.real.token"})
    assert resp.status_code == 401
