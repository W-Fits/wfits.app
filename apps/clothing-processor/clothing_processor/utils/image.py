from typing import Any, Tuple, Dict
from PIL import ImageFile, Image
import numpy as np
from numpy.typing import NDArray
import rembg
import io
import base64
from collections import Counter

# Map of colour options and hexcode
COLOUR_MAP = {
  "Black" : "#000000",
  "White" : "#FFFFFF", 
  "Grey" : "#808080", 
  "Navy" : "#000080", 
  "Beige" : "#F5F5DC", 
  "Brown" : "#8B4513", 
  "Red" : "#FF0000",
  "Pink" : "#FFC0CB", 
  "Orange" : "#FFA500", 
  "Yellow" : "#FFFF00", 
  "Green" : "#008000", 
  "Blue" : "#0000FF", 
  "Purple" : "#800080", 
  "Cream" : "#FFFDD0", 
  "Khaki" : "#C3B091", 
  "Teal" : "#008080", 
  "Mustard" : "#FFDB58", 
  "Lavender" : "#E6E6FA", 
  "Olive" : "#808000", 
  "Maroon" : "#800000", 
  "Coral" : "#FF7F50", 
  "Turquoise" : "#40E0D0", 
  "Magenta" : "#FF00FF"
}

def to_image_array(image: ImageFile.Image) -> NDArray[Any]:
  """
  Convert a PIL Image to a NumPy array.

  :param image: The input PIL Image.
  :type image: ImageFile.Image
  :raise ValueError: If conversion fails or the array is empty.
  :return: The converted NumPy array.
  :rtype: NDArray[Any]
  """
  if image is None:
    raise ValueError("Input image is None.")
  
  try:
    image_array = np.array(image)
  except Exception as e:
    raise ValueError(f"Failed to convert image to NumPy array: {e}")
  
  if image_array.size == 0:
    raise ValueError("Produced an empty image array.")

  return image_array


def remove_background(image_array: NDArray[Any]) -> tuple[NDArray[Any], Image.Image]:
  """
  Remove background from image array and return cleaned array and image.

  :param image_array: The input NumPy array of the image.
  :type image_array: NDArray[Any]
  :raise ValueError: If image is invalid or background removal fails.
  :return: A tuple containing the cleaned image array and PIL Image.
  :rtype: tuple[NDArray[Any], Image.Image]
  """
  if image_array is None or image_array.size == 0:
    raise ValueError("Input image array is None or empty.")

  try:
    output_array = rembg.remove(image_array)
    output_image = Image.fromarray(output_array)
  except Exception as e:
    raise ValueError(f"Failed to remove background from the image: {e}")

  return output_array, output_image


def to_bytes_image(image: Image.Image) -> io.BytesIO:
  """
  Convert a PIL Image to a BytesIO object.

  :param image: The input PIL Image.
  :type image: Image.Image
  :raise ValueError: If conversion to bytes fails.
  :return: The image as a BytesIO object.
  :rtype: io.BytesIO
  """
  try:
    bytes_image = io.BytesIO()
    image.save(bytes_image, format='PNG')
    bytes_image.seek(0)
    return bytes_image
  
  except Exception as e:
    raise ValueError(f"Error converting image to bytes: {e}")


def preprocess_image(image: Image.Image) -> NDArray[Any]:
  """
  Preprocess a PIL Image for model input.

  :param image: The input PIL Image.
  :type image: Image.Image
  :raise ValueError: If image is invalid or preprocessing fails.
  :return: The preprocessed image as a NumPy array.
  :rtype: NDArray[Any]
  """
  if not isinstance(image, Image.Image):
    raise ValueError("Input must be a valid PIL Image.")

  try:
    # Convert to grayscale and resize to 28x28
    image = image.convert('L').resize((28, 28))
    # Convert to numpy array and normalise to [0, 1]
    image_array = np.array(image) / 255.0
    # Add channel and batch dimensions: (1, 28, 28, 1)
    image_array = np.expand_dims(image_array, axis=(0, -1))
    return image_array
  
  except Exception as e:
    raise ValueError(f"Error during image preprocessing: {e}")
  
def to_base64(image: Image.Image) -> str:
  """
  Convert a PIL Image to a Base64 encoded string.

  :param image: The input PIL Image.
  :type image: Image.Image
  :raise ValueError: If conversion to base64 fails.
  :return: The Base64 encoded string representation of the image.
  :rtype: str
  """
  try:
    buffer = to_bytes_image(image)
    return base64.b64encode(buffer.read()).decode("utf-8")  # Encode to Base64
  except Exception as e:
    raise ValueError(f"Error converting Image to base64: {e}")



def get_rgb_colour(image_array: NDArray[Any]) -> Tuple[int, int, int]:
  """
  Find the dominant RGB colour of an image array.

  :param image_array: The input NumPy image array.
  :type image_array: NDArray[Any]
  :raise ValueError: If no visible pixels are found or the input is invalid.
  :return: The RGB tuple of the dominant colour.
  :rtype: Tuple[int, int, int]
  """
  
  if image_array.shape[-1] != 4:
    raise ValueError("Expected an RGBA image array.")

  pixels = image_array.reshape(-1, 4)
  non_transparent_pixels = pixels[pixels[:, 3] > 10, :3]  # Alpha > 10 to filter near-transparent pixels

  # If only transparent pixels
  if len(non_transparent_pixels) == 0:
    raise ValueError("No visible pixels found in the image.")

  # Get as RBG
  most_common = Counter(map(tuple, non_transparent_pixels)).most_common(1)
  rgb = most_common[0][0]  # (R, G, B)
  r, g, b = rgb
  output = (int(r), int(g), int(b))
  # Return RGB
  return output

def get_hex_colour(image_array: NDArray[Any]) -> str:
  """
  Convert the dominant RGB colour of an image array to hex code.

  :param image_array: The input NumPy image array.
  :type image_array: NDArray[Any]
  :raise ValueError: If no visible pixels are found or the input is invalid.
  :return: The hex code of the dominant colour.
  :rtype: str
  """
  return get_hex_colour(get_rgb_colour(image_array))

def rgb_to_hex(rgb: tuple) -> str:
  """
  Convert an RGB tuple to a hex code.

  :param rgb: The RGB tuple.
  :type rgb: tuple
  :raise ValueError: If the RGB tuple is invalid.
  :return: The hex code representing the colour.
  :rtype: str
  """
  if not isinstance(rgb, tuple) or len(rgb) != 3:
    raise ValueError(f"Invalid RGB tuple: {rgb}")
  return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}".upper()

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
  """
  Convert a hex code to an RGB tuple.

  :param hex_code: The hex code to convert.
  :type hex_code: str
  :raise ValueError: If the hex code is invalid.
  :return: The RGB tuple corresponding to the hex code.
  :rtype: Tuple[int, int, int]
  """
  hex_code = hex_code.lstrip('#')
  if len(hex_code) != 6:
    raise ValueError(f"Invalid hex code format: '{hex_code}'. Expected a 6-digit hex code.")

  if not all(c in '0123456789abcdefABCDEF' for c in hex_code):
    raise ValueError(f"Invalid hex code format: '{hex_code}'. Contains non-hexadecimal characters.")

  try:
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
  except Exception as e:
    raise ValueError(f"Error converting hex code '{hex_code}' to RGB: {e}")

def calculate_distance(colour1: tuple, colour2: tuple) -> float:
  """
  Calculate the Euclidean distance between two RGB colours.

  :param colour1: The first RGB tuple.
  :type colour1: tuple
  :param colour2: The second RGB tuple.
  :type colour2: tuple
  :raise ValueError: If the inputs are not valid RGB tuples.
  :return: The Euclidean distance between the two colours.
  :rtype: float
  """
  if not (isinstance(colour1, tuple) and isinstance(colour2, tuple)):
    raise ValueError("Both inputs must be tuples.")
  
  if len(colour1) != 3 or len(colour2) != 3:
    raise ValueError("Both colour tuples must have exactly 3 elements (R, G, B).")
  
  if not all(isinstance(c, (int, float)) for c in colour1 + colour2):
    raise ValueError("All colour values must be integers or floats.")
  
  return (sum((a - b) ** 2 for a, b in zip(colour1, colour2))) ** 0.5

def match_colour(rgb: Tuple[int, int, int]) -> Dict[str, str]:
  """
  Match RGB colour to the closest in the colour map.

  :param rgb: The RGB tuple to match.
  :type rgb: Tuple[int, int, int]
  :return: A dictionary containing the name and hex code of the closest matching colour.
  :rtype: Dict[str, str]
  """

  closest_colour = None
  smallest_distance = float('inf')
  
  for colour_name, hex_code in COLOUR_MAP.items():
    colour_rgb = hex_to_rgb(hex_code)
    distance = calculate_distance(rgb, colour_rgb)
    
    if distance < smallest_distance:
      smallest_distance = distance
      closest_colour = {
        "name": colour_name,
        "value": hex_code
      }
  
  return closest_colour

def get_colour(image_array: NDArray[Any]) -> Dict[str, str]:
  """
  Find the closest colour match for the dominant colour in an image.

  :param image_array: The input NumPy image array.
  :type image_array: NDArray[Any]
  :return: A dictionary containing the name and hex code of the closest matching colour.
  :rtype: Dict[str, str]
  """
  dominant_rgb = get_rgb_colour(image_array)
  return match_colour(dominant_rgb)