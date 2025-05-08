import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from outfit_gen.utils.db import parse_filters, get_items, get_prisma_client, disconnect_prisma_client

# ---------- parse_filters ----------

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

def test_parse_filters_invalid_types():
    filters = {
        "colour_id": "blue",
        "environment": "Freezing",
        "unknown": "ignored"
    }

    parsed = parse_filters(filters)

    assert parsed == {}

def test_parse_filters_partial_valid():
    filters = {
        "category_id": 2,
        "size_id": "L"
    }

    parsed = parse_filters(filters)

    assert parsed == {"category_id": 2}

# ---------- get_items ----------

@pytest.mark.asyncio
async def test_get_items_valid():
    mock_db = MagicMock()
    mock_db.item.find_many = AsyncMock(return_value=[{"id": 1, "name": "Item A"}])

    filters = {"colour_id": "1"}
    result = await get_items(mock_db, user_id=42, filters=filters)

    mock_db.item.find_many.assert_awaited_once()
    assert result == [{"id": 1, "name": "Item A"}]

@pytest.mark.asyncio
async def test_get_items_error():
    mock_db = MagicMock()
    mock_db.item.find_many = AsyncMock(side_effect=Exception("DB error"))

    result = await get_items(mock_db, user_id=42, filters={})

    assert result == []

# ---------- get_prisma_client ----------

@pytest.mark.asyncio
async def test_get_prisma_client_connects():
    with patch("outfit_gen.utils.db.Prisma") as MockPrisma:
        instance = MockPrisma.return_value
        instance.connect = AsyncMock()

        client = await get_prisma_client()
        instance.connect.assert_awaited_once()
        assert client == instance

# ---------- disconnect_prisma_client ----------

@pytest.mark.asyncio
async def test_disconnect_prisma_client():
    with patch("outfit_gen.utils.db._prisma_client", new_callable=AsyncMock) as mock_client:
        mock_client.disconnect = AsyncMock()
        with patch("outfit_gen.utils.db._prisma_client", mock_client):
            await disconnect_prisma_client()
            mock_client.disconnect.assert_awaited_once()
