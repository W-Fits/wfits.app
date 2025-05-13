import os
import pytest
from PIL import Image
from shared_utils.env import get_env
import requests
import json
from dotenv import load_dotenv

test_cases = [
    ("Black_T-shirt.jpg", "Black", "T-shirt/top"),
    ("White_Trouser.jpg", "White", "Trouser"),
    ("Grey_Pullover.jpg", "Grey", "Pullover"),
    ("Navy_Dress.jpg", "Navy", "Dress"),
    ("Beige_Coat.jpg", "Beige", "Coat"),
    ("Brown_Sandal.jpg", "Brown", "Sandal"),
    ("Red_Shirt.jpg", "Red", "Shirt"),
    ("Pink_Sneaker.jpg", "Pink", "Sneaker"),
    ("Orange_Bag.jpg", "Orange", "Bag"),
    ("Yellow_Ankle_boot.jpg", "Yellow", "Ankle boot"),
    ("Green_T-shirt.jpg", "Green", "T-shirt/top"),
    ("Blue_Trouser.jpg", "Blue", "Trouser"),
    ("Purple_Pullover.jpg", "Purple", "Pullover"),
    ("Cream_Dress.jpg", "Cream", "Dress"),
    ("Khaki_Coat.jpg", "Khaki", "Coat"),
    ("Teal_Sandal.jpg", "Teal", "Sandal"),
    ("Mustard_Shirt.jpg", "Mustard", "Shirt"),
    ("Lavender_Sneaker.jpg", "Lavender", "Sneaker"),
    ("Olive_Bag.jpg", "Olive", "Bag"),
    ("Maroon_Ankle_boot.jpg", "Maroon", "Ankle boot"),
    ("Coral_T-shirt.jpg", "Coral", "T-shirt/top"),
    ("Turquoise_Trouser.jpg", "Turquoise", "Trouser"),
    ("Magenta_Pullover.jpg", "Magenta", "Pullover"),
]

load_dotenv()

env = get_env()

TOKEN_URL = f"https://{env['AUTH0_DOMAIN']}/oauth/token"

UPLOAD_URL = "http://127.0.0.1:8000/"

def auth_token():
  """Fetch an Auth0 access token."""
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
    pytest.fail(f"Error fetching Auth0 token: {e}")
    return None

token = auth_token()

@pytest.mark.parametrize("filename, expected_colour, expected_class", test_cases)
def test_req_1(filename, expected_colour, expected_class):
  """
    Test clothing processing for different items.
    """
  if not token:
    pytest.skip("Auth0 token not available.")

  file_path = f"clothing_processor/data/test-images/assests/{filename}"
  if not os.path.exists(file_path):
    pytest.fail(f"Test image file not found: {file_path}")

  try:
    with open(file_path, "rb") as f:
        files = {"upload_file": (f.name, f, "multipart/form-data")}
        res = requests.post(
            url=UPLOAD_URL,
            headers={"Authorization": f"Bearer {token}"},
            files=files,
        )

        assert res.status_code == 200

        content = res.json()
        response_class = content["class"]
        response_colour = content["colour"]

        assert response_colour["name"] == expected_colour
        assert response_class == expected_class

  except requests.exceptions.RequestException as e:
    pytest.fail(f"Request error for {filename}: {e}")
  except json.JSONDecodeError:
    pytest.fail(f"Failed to decode JSON response for {filename}. Response: {res.text}")
  except KeyError as e:
    pytest.fail(
        f"Missing key in response for {filename}: {e}. Response: {res.json()}"
    )