import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from outfit_gen.main import app, GenerateOutfitRequest
from outfit_gen.utils.db import get_items
from outfit_gen.utils.weather import forecast
from outfit_gen.main import Item

client = TestClient(app)

# Mocking get_items to simulate database query and forecast for weather data
@pytest.mark.asyncio
@patch("outfit_gen.utils.db.get_items", new_callable=AsyncMock)
@patch("outfit_gen.utils.weather.forecast", new_callable=AsyncMock)
async def test_generate_outfit(mock_forecast, mock_get_items):
    # Mocking weather forecast data
    mock_forecast.return_value = {
        "condition": "Cold",
        "rain": True
    }

    # Mocking database items (items would normally come from the DB)
    mock_get_items.return_value = [
        Item(
            item_id=1,
            colour_id=1,
            category_id=1,
            size_id=1,
            user_id=4,
            item_name="Cold Jacket",
            item_url="http://example.com/1",
            waterproof=True,
            available=True,
            slot=1,
            environment="Cold",
            created_at=None,
            updated_at=None,
            category_tag={"category_id": 1, "category_name": "Jackets"},
            colour_tag={"colour_id": 1, "colour_name": "Blue", "colour_value": "#0000FF"},
            size_tag={"size_id": 1, "size_name": "L"}
        ),
        Item(
            item_id=2,
            colour_id=2,
            category_id=1,
            size_id=2,
            user_id=4,
            item_name="Rain Jacket",
            item_url="http://example.com/2",
            waterproof=True,
            available=True,
            slot=2,
            environment="Cold",
            created_at=None,
            updated_at=None,
            category_tag={"category_id": 1, "category_name": "Jackets"},
            colour_tag={"colour_id": 2, "colour_name": "Red", "colour_value": "#FF0000"},
            size_tag={"size_id": 2, "size_name": "M"}
        )
    ]

    # Simulate the POST request to the generate_outfit endpoint
    body = GenerateOutfitRequest(
        filters={},
        user_id=4,
        latitude=51.5074,
        longitude=-0.1278
    ).model_dump_json()

    response = client.post("/", content=body)

    # Assert the status code is 200
    assert response.status_code == 200

    # Parse the JSON response
    outfit = response.json()

    # Check that the returned outfit contains the same items as the mock data
    assert isinstance(outfit, dict)
    
    for category, item in outfit.items():
        assert "item_id" in item, f"Missing item_id in {category} item"
        assert "item_name" in item, f"Missing item_name in {category} item"
        assert "category_tag" in item, f"Missing category_tag in {category} item"
        assert "colour_tag" in item, f"Missing colour_tag in {category} item"
        assert "size_tag" in item, f"Missing size_tag in {category} item"
        
        # Ensure that the item values returned match the expected ones
        # For example, checking if category and item details match
        if category == "Jackets":
            assert item["category_tag"]["category_id"] == 1
            assert item["category_tag"]["category_name"] == "Jackets"
            assert item["colour_tag"]["colour_id"] == 1  # Assuming 'Cold Jacket' was picked
            assert item["colour_tag"]["colour_name"] == "Blue"
            assert item["size_tag"]["size_id"] == 1
            assert item["size_tag"]["size_name"] == "L"
