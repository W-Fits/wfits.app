import random
from clothing_processor.utils.image import match_colour, rgb_to_hex, to_image_array, remove_background, get_rgb_colour
from PIL import Image

def generate_colour_square(hex_colour: str) -> str:
  """Generate a coloured square using ANSI escape codes for the terminal."""
  return f"\033[48;2;{int(hex_colour[1:3], 16)};{int(hex_colour[3:5], 16)};{int(hex_colour[5:7], 16)}m  \033[0m"

def random_colour_match(num_samples: int = 100):
  """Generate random colours and test their closest match."""
  results = []
  
  for _ in range(num_samples):
    # Generate a random RGB colour
    rgb = tuple(random.randint(0, 255) for _ in range(3))
    hex_colour = rgb_to_hex(rgb)
    
    match = match_colour(rgb)

    # Store result
    results.append((hex_colour, match))

  # Display results in CLI
  for hex_colour, match in results:
    input_colour_square = generate_colour_square(hex_colour)
    match_colour_square = generate_colour_square(match["value"])
    print(f"{input_colour_square} Hex: {hex_colour} -> Matched: {match['name']}\t{match_colour_square}")

def image_colour_match():
  """Test uploading an image with the fetched token."""
  n = random.randrange(1, 8)  # Choose random file ID
  print("Starting test...")

  try:
    with open(f"data/test-images/{n}.jpeg", "rb") as f:
      image = Image.open(f)
      image_array = to_image_array(image)
      array_bg_removed, image_bg_removed = remove_background(image_array)
      
      dominant_rgb = get_rgb_colour(array_bg_removed)
      dominant_hex = rgb_to_hex(dominant_rgb)

      match = match_colour(dominant_rgb)

      image_colour_square = generate_colour_square(dominant_hex)
      match_colour_square = generate_colour_square(match["value"])

      print(f"\nResult for image {n}:")
      print(f"{image_colour_square} Hex: {dominant_hex} -> Matched: {match['name']}\t{match_colour_square}")

  except FileNotFoundError:
    print(f"File {n} not found. Skipping.")
  except Exception as e:
    print(f"Error processing file {n}: {str(e)}")
  finally:
    print("\nTest complete...")

# Run the test
if __name__ == "__main__":
  image_colour_match()
  random_colour_match()
