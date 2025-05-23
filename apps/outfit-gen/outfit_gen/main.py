from typing import Optional, Dict, List, Any
from fastapi import FastAPI, Depends, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from shared_utils.auth import auth0_auth_middleware
from outfit_gen.utils.db import get_prisma_client, get_items
from outfit_gen.utils.weather import forecast
from pydantic import BaseModel
from datetime import datetime
from collections import defaultdict
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://wfits.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateOutfitRequest(BaseModel):
    filters: Dict = {}
    user_id: int
    longitude: Optional[float] = None
    latitude: Optional[float] = None

class CategoryTag(BaseModel):
    category_id: int
    category_name: str

class ColourTag(BaseModel):
    colour_id: int
    colour_name: str
    colour_value: str

class SizeTag(BaseModel):
    size_id: int
    size_name: str

class Item(BaseModel):
    item_id: int
    colour_id: int
    category_id: int
    size_id: int
    user_id: int
    item_name: str
    item_url: str
    waterproof: bool
    available: bool
    slot: int
    environment: str
    created_at: Optional[str]  # ISO 8601 format string or None
    updated_at: Optional[str]  # ISO 8601 format string or None
    category_tag: Optional[CategoryTag] = None
    colour_tag: Optional[ColourTag] = None
    size_tag: Optional[SizeTag] = None

    class Config:
        # This ensures the datetime objects are converted to ISO format strings automatically
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

def get_items_by_category(items: List) -> Dict[str, List]:
    """
    Group items by their category name.

    :param items: List of items with a category_tag.category_name attribute.
    :type items: list
    :return: Dictionary mapping category names to lists of items.
    :rtype: dict[str, list]
    """
    items_by_category: Dict[str, List[Any]] = defaultdict(list)
    for item in items:
        try:
            category_name = item.category_tag.category_name
            items_by_category[category_name].append(item)
        except AttributeError:
            print(f"Warning: Item {item} does not have the expected category structure.")

    return dict(items_by_category)

def generate_outfit(items_by_category: Dict[str, List[Any]]) -> Dict[str, Any]:
    """
    Select one random item per category to form an outfit.

    :param items_by_category: Dictionary mapping category names to lists of items.
    :type items_by_category: dict[str, list]
    :return: Dictionary mapping category names to selected items.
    :rtype: dict[str, Any]
    """
    outfit: Dict[str, Any] = {}
    for category_name, category_items in items_by_category.items():
        if category_items:
            selected_item = random.choice(category_items)
            outfit[category_name] = selected_item
    return outfit

def to_json(item):
    """
    Convert an item object to a JSON-serializable dictionary.

    :param item: The item to serialize.
    :type item: Any
    :return: A dictionary representation of the item suitable for JSON output.
    :rtype: dict
    """
    return {
        "item_id": item.item_id,
        "colour_id": item.colour_id,
        "category_id": item.category_id,
        "size_id": item.size_id,
        "user_id": item.user_id,
        "item_name": item.item_name,
        "item_url": item.item_url,
        "waterproof": item.waterproof,
        "available": item.available,
        "slot": item.slot,
        "environment": item.environment,
        # Convert datetime objects to ISO format strings
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "updated_at": item.updated_at.isoformat() if item.updated_at else None,
        # Include details from related tags
        "category_tag": {
            "category_id": item.category_tag.category_id,
            "category_name": item.category_tag.category_name,
        } if item.category_tag else None,
        "colour_tag": {
            "colour_id": item.colour_tag.colour_id,
            "colour_name": item.colour_tag.colour_name,
            "colour_value": item.colour_tag.colour_value,
        } if item.colour_tag else None,
        "size_tag": {
            "size_id": item.size_tag.size_id,
            "size_name": item.size_tag.size_name,
        } if item.size_tag else None,
    }

def clean(outfit: Dict[str, Any]):
    """
    Convert all items in an outfit to JSON-serializable dictionaries.

    :param outfit: Dictionary mapping category names to item objects.
    :type outfit: dict[str, Any]
    :return: Dictionary with the same keys and JSON-serializable item values.
    :rtype: dict[str, dict]
    """
    output = {}
    for category, item in outfit.items():
        output[category] = to_json(item)
    return output
    
# @app.post("/", dependencies=[Depends(auth0_auth_middleware)])
@app.post("/")
async def generate_outfit_endpoint(body: GenerateOutfitRequest):
    """
    Generate an outfit based on user filters and location-based weather.

    :param body: Request body containing filters, user ID, and optional coordinates.
    :type body: GenerateOutfitRequest
    :return: JSON response with the generated outfit or an error message.
    :rtype: JSONResponse
    """
    filters = body.filters
    user_id = body.user_id
    longitude = body.longitude
    latitude = body.latitude

    try:
        db = await get_prisma_client()

        if longitude and latitude:
            weather = await forecast(latitude, longitude)

            filters["environment"] = weather["condition"]
            filters["waterproof"] = weather["rain"]

        items = await get_items(db, user_id, filters)

        items_by_category = get_items_by_category(items)

        outfit = generate_outfit(items_by_category)

        cleaned_output = clean(outfit)

        return JSONResponse(content=cleaned_output)

    except Exception as e:
        return JSONResponse(
            content={"error": f"Couldn't generate outfit: {str(e)}"},
            status_code=500,
        )