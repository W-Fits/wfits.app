from typing import Optional, Dict, List, Any
from fastapi import FastAPI, Depends, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from shared_utils.auth import auth0_auth_middleware
from outfit_gen.utils.db import get_prisma_client, get_items
from outfit_gen.utils.weather import forecast
from pydantic import BaseModel
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

def get_items_by_category(items: List) -> Dict[str, List]:
    """Organises items by category."""
    items_by_category: Dict[str, List[Any]] = defaultdict(list)
    for item in items:
        try:
            category_name = item.category_tag.category_name
            items_by_category[category_name].append(item)
        except AttributeError:
            print(f"Warning: Item {item} does not have the expected category structure.")

    return dict(items_by_category)

def generate_outfit(items_by_category: Dict[str, List[Any]]) -> Dict[str, Any]:
    """Generates an outfit by selecting one item from each category."""
    outfit: Dict[str, Any] = {}
    for category_name, category_items in items_by_category.items():
        if category_items:
            selected_item = random.choice(category_items)
            outfit[category_name] = selected_item
    return outfit

def to_json(item):
    """Converts the Item object to a JSON-serializable dictionary."""
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
    output = {}
    for category, item in outfit.items():
        output[category] = to_json(item)
    return output
    
# @app.post("/", dependencies=[Depends(auth0_auth_middleware)])
@app.post("/")
async def generate_outfit_endpoint(body: GenerateOutfitRequest):
    """Generates an outfit based on the provided filters,
    selecting one item per category."""
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

@app.get("/test")
async def test_endpoint():
    filters = {}
    longitude = latitude = None
    user_id = 1
    try:
        db = await get_prisma_client()

        if longitude and latitude:
            weather = await forecast(latitude, longitude)

            filters["environment"] = weather["condition"]
            filters["waterproof"] = weather["rain"]

        items = await get_items(db, user_id, filters)

        items_by_category = get_items_by_category(items)

        outfit = generate_outfit(items_by_category)

        return JSONResponse(content=outfit)

    except Exception as e:
        return JSONResponse(
            content={"error": f"Couldn't generate outfit: {str(e)}"},
            status_code=500,
        )
