import pytest
from unittest.mock import AsyncMock, patch
from outfit_gen.main import app 
from outfit_gen.main import GenerateOutfitRequest
from fastapi.testclient import TestClient

client = TestClient(app)

@pytest.mark.asyncio
@patch("outfit_gen.utils.weather.forecast", new_callable=AsyncMock)
async def test_generate_outfit_with_rain_and_cold(mock_forecast):
    mock_forecast.return_value = {
        "condition": "Cold",
        "rain": True
    }

    body = GenerateOutfitRequest(
      filters={},
      user_id=4,
      latitude=51.5074,
      longitude=-0.1278
    ).model_dump_json()

    response = client.post("/", content=body)

    assert response.status_code == 200

    outfit = response.json()
    assert isinstance(outfit, dict)
    for category, item in outfit.items():
        assert item["environment"] == "Cold", f"{category} item has incorrect environment: {item}"

@pytest.mark.asyncio
@patch("outfit_gen.utils.weather.forecast", new_callable=AsyncMock)
async def test_generate_outfit_with_rain_and_cold(mock_forecast):
    mock_forecast.return_value = {
        "condition": "Warm",
        "rain": False
    }

    body = GenerateOutfitRequest(
      filters={},
      user_id=4,
      latitude=51.5074,
      longitude=-0.1278
    ).model_dump_json()

    response = client.post("/", content=body)

    assert response.status_code == 200

    outfit = response.json()
    assert isinstance(outfit, dict)
    for category, item in outfit.items():
        assert item["environment"] == "Warm", f"{category} item has incorrect environment: {item}"