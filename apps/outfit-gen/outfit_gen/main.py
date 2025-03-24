from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from shared_utils.auth import auth0_auth_middleware
from fastapi.middleware.cors import CORSMiddleware

# from mangum import Mangum

# Initialise FastAPI app
app = FastAPI()

# Enable CORS to allow requests from frontent
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

@app.post("/", dependencies=[Depends(auth0_auth_middleware)])
async def generate_outfit():
  try:
    response_content = { "message": "hello world" }

    return JSONResponse(content=response_content)

  except Exception as e:
    return JSONResponse(content={"error": f"Couldn't generate outfit: {str(e)}"}, status_code=500)