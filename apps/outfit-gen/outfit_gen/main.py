from typing import Optional, Dict
from fastapi import FastAPI, Depends, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from shared_utils.auth import auth0_auth_middleware
from outfit_gen.utils.db import get_prisma_client, get_items
from outfit_gen.utils.weather import forecast

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:3000", 
    "https://wfits.app"
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

def validate_response(response_content): 
  return [item.dict() for item in response_content]

@app.post("/", dependencies=[Depends(auth0_auth_middleware)])
async def generate_outfit(
  filters: Dict = Body({}),
  user_id: int = Body(..., embed=True),
  longitude: Optional[float] = Body(None, embed=True),
  latitude: Optional[float] = Body(None, embed=True),
):
  """Generates an outfit based on the provided filters"""
  try:
    db = await get_prisma_client()

    if longitude and latitude:
      weather = await forecast(latitude, longitude)

      filters["environment"] = weather["condition"]
      filters["waterproof"] = weather["rain"]
    
    items = await get_items(db, user_id, filters)

    return JSONResponse(content=validate_response(items))

  except Exception as e:
    return JSONResponse(content={"error": f"Couldn't generate outfit: {str(e)}"}, status_code=500)