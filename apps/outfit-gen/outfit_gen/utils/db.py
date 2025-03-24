from prisma import Prisma
from prisma.models import Item as PrismaItem
from typing import List, Optional, Dict

_prisma_client = None

ALLOWED_FILTERS = {
  "colour_id": int,
  "category_id": int,
  "size_id": int,
  "environment": str,  
  "waterproof": bool,
}

def parse_filters(filters: Dict) -> Dict:
  """Validates and converts filter values based on ALLOWED_FILTERS."""
  validated_filters = {}
  for key, value in filters.items():
    if key in ALLOWED_FILTERS:
      expected_type = ALLOWED_FILTERS[key]
      try:
        if expected_type == str:
          if key == "environment":
            if value not in ("Warm", "Cold"):
              print(f"Invalid environment value: {value}")
              continue
          converted_value = str(value)
        else:
          converted_value = expected_type(value)
        validated_filters[key] = converted_value
      except (ValueError, TypeError) as e:
        print(f"Invalid value for filter {key}: {e}")
        continue
    else:
      print(f"Ignoring disallowed filter: {key}")
  return validated_filters


async def get_items(
  db: Prisma,
  user_id: int,
  filters: Dict,
) -> List[PrismaItem]:
  """Applies filters to the Item table based on the provided criteria, user ID, and optional location."""

  where_clause = {"user_id": user_id}  # Base filter: items for the user

  validated_filters = parse_filters(filters)

  where_clause.update(validated_filters)

  try:
    items = await db.item.find_many(where=where_clause)
    return items
  except Exception as e:
    print(f"Error fetching items: {e}")
    return []  


async def get_prisma_client() -> Prisma:
  """Returns a Prisma client instance, caching it for reuse."""
  global _prisma_client

  if _prisma_client is None:
    _prisma_client = Prisma()
    try:
      await _prisma_client.connect()
      print("Connected to the database via Prisma!")
    except Exception as e:
      print(f"Error connecting to the database: {e}")
      _prisma_client = None
      raise
  return _prisma_client


async def disconnect_prisma_client():
  """Disconnects the Prisma client if it's currently connected."""
  global _prisma_client
  if _prisma_client:
    try:
      await _prisma_client.disconnect()
      print("Disconnected from the database.")
    except Exception as e:
      print(f"Error disconnecting from the database: {e}")
    finally:
      _prisma_client = None