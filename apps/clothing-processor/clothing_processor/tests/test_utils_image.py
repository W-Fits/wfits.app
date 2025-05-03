import pytest
import numpy as np
from PIL import Image
import io
import base64
import rembg

from clothing_processor.utils.image import (
  to_image_array,
  remove_background,
  to_bytes_image,
  preprocess_image,
  to_base64,
  get_rgb_colour,
  rgb_to_hex,
  hex_to_rgb,
  calculate_distance,
  match_colour,
  get_colour,
  COLOUR_MAP,
)

def create_test_image(width=10, height=10, color=(255, 0, 0, 255), mode='RGBA'):
  """Creates a simple PIL Image with a solid color."""
  if mode == 'RGBA':
      img = Image.new(mode, (width, height), color)
  elif mode == 'L':
      img = Image.new(mode, (width, height), color[0]) # For grayscale
  else:
      raise ValueError(f"Unsupported mode: {mode}")
  return img

def test_to_image_array_valid_image():
  img = create_test_image()
  img_array = to_image_array(img)
  assert isinstance(img_array, np.ndarray)
  assert img_array.shape == (10, 10, 4)
  assert np.all(img_array == np.array([255, 0, 0, 255]))

def test_to_image_array_none_input():
  with pytest.raises(ValueError, match="Input image is None."):
    to_image_array(None)

def test_to_image_array_empty_image():
  class MockEmptyImage:
    def __array__(self):
      return np.array([])

  with pytest.raises(ValueError, match="Produced an empty image array."):
    to_image_array(MockEmptyImage())

def test_remove_background_valid_input():
  img_array = np.zeros((10, 10, 4), dtype=np.uint8)
  img_array[2:8, 2:8] = [255, 0, 0, 255] # A red square with alpha

  # Mock rembg.remove to return a predictable output for testing
  original_rembg_remove = rembg.remove
  def mock_rembg_remove(data):
    output = data.copy()
    output[:2, :] = 0
    return output
  rembg.remove = mock_rembg_remove

  try:
    output_array, output_image = remove_background(img_array)
    assert isinstance(output_array, np.ndarray)
    assert isinstance(output_image, Image.Image)
    assert output_array.shape == img_array.shape
    assert output_image.size == (img_array.shape[1], img_array.shape[0])
    assert np.all(output_array[:2, :, 3] == 0)

  finally:
    rembg.remove = original_rembg_remove


def test_remove_background_none_input():
  with pytest.raises(ValueError, match="Input image array is None or empty."):
    remove_background(None)

def test_remove_background_empty_input():
  with pytest.raises(ValueError, match="Input image array is None or empty."):
    remove_background(np.array([]))

def test_to_bytes_image_valid_image():
  img = create_test_image()
  bytes_io = to_bytes_image(img)
  assert isinstance(bytes_io, io.BytesIO)
  assert len(bytes_io.getvalue()) > 0

def test_to_bytes_image_invalid_image_object():
  with pytest.raises(ValueError, match="Error converting image to bytes: "):
    to_bytes_image("not an image")

def test_preprocess_image_valid_image():
  img = create_test_image(width=100, height=100, mode='RGBA') 
  processed_array = preprocess_image(img)
  assert isinstance(processed_array, np.ndarray)
  assert processed_array.shape == (1, 28, 28, 1) 
  assert np.max(processed_array) <= 1.0
  assert np.min(processed_array) >= 0.0

def test_preprocess_image_invalid_input_type():
  with pytest.raises(ValueError, match="Input must be a valid PIL Image."):
    preprocess_image(np.zeros((10, 10))) 

def test_to_base64_valid_image():
  img = create_test_image()
  base64_string = to_base64(img)
  assert isinstance(base64_string, str)
  assert len(base64_string) > 0

  decoded_bytes = base64.b64decode(base64_string)
  assert len(decoded_bytes) > 0

def test_get_rgb_colour_solid_color_image():
  img_array = np.full((10, 10, 4), [255, 0, 0, 255], dtype=np.uint8) # Solid Red
  rgb = get_rgb_colour(img_array)
  assert rgb == (255, 0, 0)

def test_get_rgb_colour_with_transparency():
  img_array = np.zeros((10, 10, 4), dtype=np.uint8)
  img_array[2:8, 2:8] = [0, 255, 0, 255] # Green square
  img_array[0:2, :] = [255, 0, 0, 10] # Mostly transparent red
  rgb = get_rgb_colour(img_array)
  assert rgb == (0, 255, 0) # Should detect the dominant green

def test_get_rgb_colour_no_visible_pixels():
  img_array = np.zeros((10, 10, 4), dtype=np.uint8)
  with pytest.raises(ValueError, match="No visible pixels found in the image."):
    get_rgb_colour(img_array)

def test_get_rgb_colour_invalid_shape():
  img_array_rgb = np.zeros((10, 10, 3), dtype=np.uint8)
  with pytest.raises(ValueError, match="Expected an RGBA image array."):
    get_rgb_colour(img_array_rgb)

def test_rgb_to_hex_valid_rgb():
  assert rgb_to_hex((255, 0, 0)) == "#FF0000"
  assert rgb_to_hex((0, 255, 0)) == "#00FF00"
  assert rgb_to_hex((0, 0, 255)) == "#0000FF"
  assert rgb_to_hex((128, 128, 128)) == "#808080"
  assert rgb_to_hex((0, 0, 0)) == "#000000"
  assert rgb_to_hex((255, 255, 255)) == "#FFFFFF"

def test_rgb_to_hex_invalid_input_type():
  with pytest.raises(ValueError, match="Invalid RGB tuple: "):
    rgb_to_hex([255, 0, 0]) 

  with pytest.raises(ValueError, match="Invalid RGB tuple: "):
    rgb_to_hex((255, 0))

  with pytest.raises(ValueError, match="Invalid RGB tuple: "):
    rgb_to_hex((255, 0, 0, 0))

def test_hex_to_rgb_valid_hex():
  assert hex_to_rgb("#FF0000") == (255, 0, 0)
  assert hex_to_rgb("00FF00") == (0, 255, 0) 
  assert hex_to_rgb("#0000FF") == (0, 0, 255)
  assert hex_to_rgb("#808080") == (128, 128, 128)
  assert hex_to_rgb("#000000") == (0, 0, 0)
  assert hex_to_rgb("#FFFFFF") == (255, 255, 255)

def test_hex_to_rgb_invalid_hex_format():
  with pytest.raises(ValueError): 
    hex_to_rgb("#gg0000") # Invalid hex characters

  with pytest.raises(ValueError): 
    hex_to_rgb("#ff00") # Too short

  with pytest.raises(ValueError):
    hex_to_rgb("#FF000000") # Too long

def test_calculate_distance_same_colour():
  assert calculate_distance((255, 0, 0), (255, 0, 0)) == 0.0

def test_calculate_distance_different_colours():
  assert calculate_distance((0, 0, 0), (255, 0, 0)) == 255.0
  assert calculate_distance((0, 0, 0), (0, 255, 0)) == 255.0
  assert calculate_distance((0, 0, 0), (0, 0, 255)) == 255.0

  distance_red_blue = calculate_distance((255, 0, 0), (0, 0, 255))
  assert distance_red_blue == pytest.approx(((255-0)**2 + (0-0)**2 + (0-255)**2)**0.5)

def test_calculate_distance_invalid_input_types():
  with pytest.raises(ValueError, match="Both inputs must be tuples."):
    calculate_distance([255, 0, 0], (0, 0, 0))

  with pytest.raises(ValueError, match="Both inputs must be tuples."):
    calculate_distance((255, 0, 0), [0, 0, 0])

def test_calculate_distance_invalid_tuple_length():
  with pytest.raises(ValueError, match="Both colour tuples must have exactly 3 elements"):
    calculate_distance((255, 0), (0, 0, 0))

  with pytest.raises(ValueError, match="Both colour tuples must have exactly 3 elements"):
    calculate_distance((255, 0, 0), (0, 0, 0, 0))

def test_calculate_distance_invalid_value_types():
  with pytest.raises(ValueError, match="All colour values must be integers or floats."):
    calculate_distance(("red", 0, 0), (0, 0, 0))


def test_match_colour_perfect_match():
  red_rgb = hex_to_rgb(COLOUR_MAP["Red"])
  matched_colour = match_colour(red_rgb)
  assert matched_colour is not None
  assert matched_colour["name"] == "Red"
  assert matched_colour["value"] == "#FF0000"

def test_match_colour_closest_match():
  slightly_off_red_rgb = (250, 10, 10)
  matched_colour = match_colour(slightly_off_red_rgb)
  assert matched_colour is not None
  assert matched_colour["name"] == "Red"
  assert matched_colour["value"] == "#FF0000"

def test_match_colour_colour_between_map_entries():
  purple_rgb = (128, 0, 128)
  matched_colour = match_colour(purple_rgb)
  assert matched_colour is not None
  assert matched_colour["name"] == "Purple"
  assert matched_colour["value"] == "#800080"

def test_match_colour_empty_colour_map():
  original_colour_map = COLOUR_MAP.copy()
  COLOUR_MAP.clear()
  try:
    matched_colour = match_colour((10, 20, 30))
    assert matched_colour is None
  finally:
    COLOUR_MAP.update(original_colour_map)

def test_get_colour_valid_input():
  img_array = np.full((10, 10, 4), [255, 0, 0, 255], dtype=np.uint8) # Solid Red
  matched_colour = get_colour(img_array)
  assert matched_colour is not None
  assert matched_colour["name"] == "Red"
  assert matched_colour["value"] == "#FF0000"

def test_get_colour_no_visible_pixels():
  img_array = np.zeros((10, 10, 4), dtype=np.uint8) 
  with pytest.raises(ValueError, match="No visible pixels found in the image."):
    get_colour(img_array)

def test_get_colour_invalid_image_array_shape():
  img_array_rgb = np.zeros((10, 10, 3), dtype=np.uint8) 
  with pytest.raises(ValueError, match="Expected an RGBA image array."):
    get_colour(img_array_rgb)