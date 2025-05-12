import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from outfit_gen.utils.db import parse_filters, get_items, get_prisma_client, disconnect_prisma_client

# Tests parsing of valid filter input and correct type conversion
def test_parse_filters_valid():
    filters = {
        "colour_id": "1",
        "category_id": 2,
        "environment": "Warm",
        "waterproof": "True",
    }
    parsed = parse_filters(filters)
    assert parsed == {
        "colour_id": 1,
        "category_id": 2,
        "environment": "Warm",
        "waterproof": True
    }

    # Use logging to capture the result for testing purposes
    print({
        "status": 200,
        "message": f"Valid filters parsed and type-converted successfully: {parsed}"
    })

# Tests that invalid or unsupported filter values are ignored
def test_parse_filters_invalid_types():
    filters = {
        "colour_id": "blue",
        "environment": "Freezing",
        "unknown": "ignored"
    }
    parsed = parse_filters(filters)
    assert parsed == {}

    print({
        "status": 200,
        "message": "Invalid filters ignored successfully"
    })

# Tests that only valid filters are returned when some are invalid
def test_parse_filters_partial_valid():
    filters = {
        "category_id": 2,
        "size_id": "L"
    }
    parsed = parse_filters(filters)
    assert parsed == {"category_id": 2}

    print({
        "status": 200,
        "message": f"Partial valid filters parsed: {parsed}"
    })

# Tests get_items successfully returns filtered items from the mock database
@pytest.mark.asyncio
async def test_get_items_valid():
    mock_db = MagicMock()
    mock_db.item.find_many = AsyncMock(return_value=[{"id": 1, "name": "Item A"}])
    filters = {"colour_id": "1"}
    result = await get_items(mock_db, user_id=42, filters=filters)
    mock_db.item.find_many.assert_awaited_once()
    assert result == [{"id": 1, "name": "Item A"}]

    print({
        "status": 200,
        "message": f"Filtered items fetched successfully: {result}"
    })

# Tests get_items handles database errors gracefully and returns an empty list
@pytest.mark.asyncio
async def test_get_items_error():
    mock_db = MagicMock()
    mock_db.item.find_many = AsyncMock(side_effect=Exception("DB error"))
    result = await get_items(mock_db, user_id=42, filters={})
    assert result == []

    print({
        "status": 500,
        "message": "Error fetching items: DB error"
    })

# Tests get_prisma_client connects and returns the client instance
@pytest.mark.asyncio
async def test_get_prisma_client_connects():
    with patch("outfit_gen.utils.db.Prisma") as MockPrisma:
        instance = MockPrisma.return_value
        instance.connect = AsyncMock()
        client = await get_prisma_client()
        instance.connect.assert_awaited_once()
        assert client == instance
    
    print({
        "status": 200,
        "message": "Prisma client connected successfully"
    })

# Tests disconnect_prisma_client properly calls disconnect and clears the client
@pytest.mark.asyncio
async def test_disconnect_prisma_client():
    with patch("outfit_gen.utils.db._prisma_client", new_callable=AsyncMock) as mock_client:
        mock_client.disconnect = AsyncMock()
        with patch("outfit_gen.utils.db._prisma_client", mock_client):
            await disconnect_prisma_client()
            mock_client.disconnect.assert_awaited_once()

    print({
        "status": 200,
        "message": "Prisma client disconnected successfully"
    })
