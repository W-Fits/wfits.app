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
  """
  Validate and convert filter values based on allowed filters.

  :param filters: A dictionary of filters to validate and convert.
  :type filters: dict
  :raise ValueError: If a filter value is invalid or cannot be converted.
  :return: A dictionary of validated and converted filters.
  :rtype: dict[str, Any]
  """
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
  """
  Apply filters to the Item table based on user ID and filter criteria.

  :param db: The Prisma database client.
  :type db: Prisma
  :param user_id: The ID of the user whose items are being fetched.
  :type user_id: int
  :param filters: A dictionary of filter criteria to apply to the query.
  :type filters: dict
  :raise Exception: If there is an error fetching items from the database.
  :return: A list of items that match the filters and user ID.
  :rtype: list[PrismaItem]
  """

  where_clause = {"user_id": user_id}  # Base filter: items for the user

  validated_filters = parse_filters(filters)

  where_clause.update(validated_filters)

  try:
    items = await db.item.find_many(
      where=where_clause,
      include={"category_tag": True, "colour_tag": True, "size_tag": True}
    )
    return items
  except Exception as e:
    print(f"Error fetching items: {e}")
    return []  


async def get_prisma_client() -> Prisma:
  """
  Return a Prisma client instance, reusing a cached instance if available.

  :param: This function takes no parameters.
  :type: n/a
  :raise Exception: If there is an error connecting to the database.
  :return: A Prisma client instance connected to the database.
  :rtype: Prisma
  """
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
  """
  Disconnect the Prisma client if it is currently connected.

  :param: This function takes no parameters.
  :type: n/a
  :raise Exception: If there is an error disconnecting from the database.
  :return: n/a
  :rtype: n/a
  """
  global _prisma_client
  if _prisma_client:
    try:
      await _prisma_client.disconnect()
      print("Disconnected from the database.")
    except Exception as e:
      print(f"Error disconnecting from the database: {e}")
    finally:
      _prisma_client = None