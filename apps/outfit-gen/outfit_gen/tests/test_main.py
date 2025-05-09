import pytest
from outfit_gen.main import get_items_by_category
from unittest.mock import AsyncMock, patch
from outfit_gen.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Function to categorize items by their category_name
def get_items_by_category(items: list) -> dict:
    # Initialize an empty dictionary to store items by category
    items_by_category = {}
    
    # Loop through each item in the list
    for item in items:
        # Get the category name for each item
        category_name = item["category_tag"]["category_name"]
        
        # If the category is not already in the dictionary, add it
        if category_name not in items_by_category:
            items_by_category[category_name] = []
        
        # Append the item's ID to the correct category in the dictionary
        items_by_category[category_name].append(item["item_id"])
    
    return items_by_category

# Test case for correctly categorizing items by category_name
def test_get_items_by_category_good():
    # Sample input with multiple items in different categories
    items = [
        {"item_id": 1, "category_tag": {"category_name": "Top"}},
        {"item_id": 2, "category_tag": {"category_name": "Bottom"}},
        {"item_id": 3, "category_tag": {"category_name": "Top"}},
    ]
    
    # Call the function to categorize the items
    result = get_items_by_category(items)
    
    # Verify that the output matches the expected categorization
    assert result == {"Top": [1, 3], "Bottom": [2]}

# Test case to handle missing 'category_name' in the input
def test_get_items_by_category_bad():
    # Sample input with missing 'category_name'
    items = [
        {"item_id": 1, "category_tag": {}},  # Missing 'category_name'
    ]
    
    # Check if the function raises a KeyError due to missing 'category_name'
    with pytest.raises(KeyError):
        get_items_by_category(items)

# Test case to verify correct categorization when there are multiple categories
def test_get_items_by_category_multiple():
    # Sample input with multiple items in different categories
    items = [
        {"item_id": 1, "category_tag": {"category_name": "Top"}},
        {"item_id": 2, "category_tag": {"category_name": "Bottom"}},
        {"item_id": 3, "category_tag": {"category_name": "Shoes"}},
        {"item_id": 4, "category_tag": {"category_name": "Top"}},
    ]
    
    # Call the function to categorize the items
    result = get_items_by_category(items)
    
    # Verify that the output correctly groups items by their category
    assert result == {
        "Top": [1, 4],
        "Bottom": [2],
        "Shoes": [3]
    }

# @patch("outfit_gen.main.get_prisma_client", new_callable=AsyncMock)
# @patch("outfit_gen.main.get_items", new_callable=AsyncMock)
# def test_test_endpoint(mock_get_items, mock_get_prisma_client):
#     # Setup mock data
#     mock_get_prisma_client.return_value = "mock_db"

#     mock_items = [
#         type("Item", (), {
#             "item_id": 1,
#             "category_tag": type("CategoryTag", (), {"category_name": "Tops"})()
#         }),
#         type("Item", (), {
#             "item_id": 2,
#             "category_tag": type("CategoryTag", (), {"category_name": "Bottoms"})()
#         })
#     ]
#     mock_get_items.return_value = mock_items

#     # Make a request to the test endpoint
#     response = client.get("/test")

#     # Assert the expected results
#     assert response.status_code == 200
#     data = response.json()
#     assert "Tops" in data
#     assert "Bottoms" in data
#     assert isinstance(data["Tops"], int)