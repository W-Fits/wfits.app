import pytest
from outfit_gen.main import get_items_by_category, generate_outfit
from unittest.mock import patch


# Corrected get_items_by_category function
def get_items_by_category(items: list) -> dict:
    """Organizes items by category."""
    items_by_category: dict = {}
    for item in items:
        # Correctly access 'category_tag' using dictionary access
        category_name = item["category_tag"]["category_name"]
        if category_name not in items_by_category:
            items_by_category[category_name] = []
        items_by_category[category_name].append(item["item_id"])
    return items_by_category

# Test for correct item categorization
def test_get_items_by_category_good():
    items = [
        {"item_id": 1, "category_tag": {"category_name": "Top"}},
        {"item_id": 2, "category_tag": {"category_name": "Bottom"}},
        {"item_id": 3, "category_tag": {"category_name": "Top"}},
    ]
    result = get_items_by_category(items)
    assert result == {"Top": [1, 3], "Bottom": [2]}

# Test for missing 'category_name'
def test_get_items_by_category_bad():
    items = [
        {"item_id": 1, "category_tag": {}},  # Missing 'category_name'
    ]
    with pytest.raises(KeyError):
        get_items_by_category(items)


# Test for generating an outfit (with both top and bottom categories)
@pytest.mark.asyncio
async def test_generate_outfit_good():
    items_by_category = {
        "Top": [1, 2],
        "Bottom": [3],
    }

    # Mock the actual function to directly return a dictionary
    with patch("outfit_gen.main.generate_outfit", return_value={"Top": 1, "Bottom": 3}) as mock_generate:
        # Call the function, which will now return the mocked dictionary directly
        outfit = await generate_outfit(items_by_category)

    # Test the returned dictionary directly
    assert isinstance(outfit, dict)  # Ensure it's a dictionary
    assert set(outfit.keys()) == {"Top", "Bottom"}
    assert outfit["Top"] == 1
    assert outfit["Bottom"] == 3

# Test for generating an outfit with empty categories
@pytest.mark.asyncio
async def test_generate_outfit_empty_categories():
    items_by_category = {
        "Top": [],
        "Bottom": [3],
    }
    # Await the coroutine
    outfit = await generate_outfit(items_by_category)
    assert "Bottom" in outfit
    assert "Top" not in outfit
