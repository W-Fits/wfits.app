from typing import Optional, Dict, List
from fastapi import FastAPI, Depends, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from shared_utils.auth import auth0_auth_middleware
from outfit_gen.utils.db import get_prisma_client, get_items
from outfit_gen.utils.weather import forecast
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://wfits.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_items_by_category(items: List) -> Dict[str, List]:
    """Organizes items by category."""
    items_by_category: Dict[str, List] = {}
    for item in items:
        category_name = item.category_tag.category_name
        if category_name not in items_by_category:
            items_by_category[category_name] = []
        items_by_category[category_name].append(item.item_id)
    return items_by_category

def generate_outfit(items_by_category: Dict[str, List]) -> List:
    """Generates an outfit by selecting one item from each category."""
    outfit = {}
    for category_name, category_items in items_by_category.items():
        if category_items:
            selected_item_id = random.choice(category_items)
            outfit[category_name] = (selected_item_id)
    return outfit

@app.post("/", dependencies=[Depends(auth0_auth_middleware)])
async def generate_outfit(
filters: Dict = Body({}),
    user_id: int = Body(..., embed=True),
    longitude: Optional[float] = Body(None, embed=True),
    latitude: Optional[float] = Body(None, embed=True),
):
    """Generates an outfit based on the provided filters,
    selecting one item per category."""
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
