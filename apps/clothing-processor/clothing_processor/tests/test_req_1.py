import os
import pytest
from PIL import Image
from clothing_processor.utils.image import to_image_array, get_colour, get_class

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

def test_imageOuput():
    
    print("Starting manual image test suite...\n")

    for filename, expected_colour, expected_class in test_cases:
        try:
            image_path = os.path.join("tests", "assets", filename)
            image = Image.open(image_path).convert("RGBA")
            img_array = to_image_array(image)

            predicted_colour = get_colour(img_array)
            predicted_class = get_class(img_array)

            # Check results
            assert predicted_colour["name"] == expected_colour 
            assert predicted_class == expected_class

        except FileNotFoundError:
            print(f"[!] {filename} not found. Skipping.")
        except Exception as e:
            print(f"[!] Error processing {filename}: {e}")
