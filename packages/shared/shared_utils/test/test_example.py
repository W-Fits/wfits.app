import json
import requests
import pytest
from fastapi import HTTPException
from shared_utils.env import get_env 
from shared_utils.auth import verify_auth0_token

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