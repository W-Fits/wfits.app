import json
import requests
import pytest
from fastapi import HTTPException
from fastapi import Depends, HTTPException, Request, FastAPI
from fastapi.security import HTTPBearer
import jwt
import http.client
import json
import dotenv
import os

# Caching environment variables
_env = None

def get_env():
  """Get environment variables with caching."""
  global _env
  if _env is None:
    dotenv.load_dotenv()
    _env = {
      "AUTH0_CLIENT_ID": os.getenv("AUTH0_CLIENT_ID"),
      "AUTH0_CLIENT_SECRET": os.getenv("AUTH0_CLIENT_SECRET"),
      "AUTH_TOKEN": os.getenv("AUTH_TOKEN"),
      "AUTH0_DOMAIN": os.getenv("AUTH0_DOMAIN"),
      "AUTH0_AUDIENCE":  os.getenv("AUTH0_AUDIENCE"),
      "AWS_ACCESS_KEY_ID": os.getenv("AWS_ACCESS_KEY_ID"),
      "AWS_SECRET_ACCESS_KEY": os.getenv("AWS_SECRET_ACCESS_KEY"),
      "AWS_DEFAULT_REGION": os.getenv("AWS_DEFAULT_REGION"),
      "AWS_URL": os.getenv("AWS_DEFAULT_REGION"),
      "DATABASE_URL": os.getenv("DATABASE_URL")
    }
  return _env

# Security scheme for extracting tokens
security = HTTPBearer()

async def fetch_auth0_jwks():
  """Fetch Auth0's JWKS (JSON Web Key Set)"""
  env = get_env()
  try:
    conn = http.client.HTTPSConnection(env["AUTH0_DOMAIN"])
    conn.request("GET", "/.well-known/jwks.json")
    response = conn.getresponse()
    if response.status != 200:
      raise Exception("Failed to fetch JWKS")
    jwks = json.loads(response.read().decode())
    return jwks
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error fetching JWKS: {str(e)}")


async def verify_auth0_token(id_token: str):
  """Verify Auth0 JWT token."""
  env = get_env()
  try:
    jwks = await fetch_auth0_jwks()  # Get public keys from Auth0

    # Decode JWT header to get 'kid'
    unverified_header = jwt.get_unverified_header(id_token)
    kid = unverified_header.get("kid")

    # Find the corresponding public key
    public_key = None
    for key in jwks["keys"]:
      if key["kid"] == kid:
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
        break

    if not public_key:
      raise HTTPException(status_code=401, detail="Public key not found")

    # Verify the token
    claims = jwt.decode(
      id_token,
      public_key,
      algorithms=["RS256"],
      audience=env["AUTH0_AUDIENCE"],
      issuer=f"https://{env['AUTH0_DOMAIN']}/",
    )
    return claims

  except jwt.ExpiredSignatureError:
    raise HTTPException(status_code=401, detail="Token expired")
  except jwt.InvalidTokenError:
    raise HTTPException(status_code=401, detail="Invalid token")
  except Exception as e:
    raise HTTPException(status_code=401, detail=f"Token verification error: {str(e)}")

async def auth0_auth_middleware(request: Request, token: str = Depends(security)):
  """Middleware to validate Auth0 token."""
  id_token = token.credentials
  claims = await verify_auth0_token(id_token)
  return claims


def get_auth0_token():
  """Fetch an Auth0 access token."""
  env = get_env()

  print("AUTH0_DOMAIN:", env.get("AUTH0_DOMAIN"))
  TOKEN_URL = f"https://{env['AUTH0_DOMAIN']}/oauth/token"
  try:
    res = requests.post(
      TOKEN_URL,
      headers={"Content-Type": "application/json"},
      data=json.dumps({
        "client_id": env["AUTH0_CLIENT_ID"],
        "client_secret": env["AUTH0_CLIENT_SECRET"],
        "audience": env["AUTH0_AUDIENCE"],
        "grant_type": "client_credentials"
      }),
    )
    res.raise_for_status()
    return res.json().get("access_token")
  except requests.exceptions.RequestException as e:
    print(f"Error fetching Auth0 token: {e}")
    return None

@pytest.mark.asyncio
async def test_verify_auth0():
  assert await verify_auth0_token(get_auth0_token()) != HTTPException(status_code=401, detail="Token expired")