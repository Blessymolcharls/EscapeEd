import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "EscapeEd" in data["service"]

def test_get_puzzle():
    response = client.get("/api/puzzle")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "puzzle_m1_slicing"
    assert "runes = [" in data["code"]
    assert "print(result)" in data["code"]

def test_verify_puzzle_incorrect():
    response = client.post("/api/verify", json={"puzzle_id": "puzzle_m1_slicing", "answer": "WRONG_OUTPUT"})
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is False
    assert data["unlocked"] is False
    assert data["hint"] is not None

def test_verify_puzzle_correct():
    response = client.post("/api/verify", json={"puzzle_id": "puzzle_m1_slicing", "answer": "ATE_3"})
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is True
    assert data["unlocked"] is True
    assert "unlatches" in data["message"].lower() or "open" in data["message"].lower()

def test_verify_puzzle_case_insensitive():
    response = client.post("/api/verify", json={"puzzle_id": "puzzle_m1_slicing", "answer": "  ate_3 "})
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is True
    assert data["unlocked"] is True

if __name__ == "__main__":
    test_health_check()
    test_get_puzzle()
    test_verify_puzzle_incorrect()
    test_verify_puzzle_correct()
    test_verify_puzzle_case_insensitive()
    print("ALL BACKEND TESTS PASSED SUCCESSFULLY!")
