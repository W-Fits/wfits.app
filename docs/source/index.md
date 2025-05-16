# wfits.app Documentation

This documentation outlines the core components of `wfits.app`, including image analysis, colour extraction, AWS S3 storage, model predictions, and file handling.

---

## Modules and Functions

### [Main](clothing_processor/main.md)
Functions that handle the core processing logic and orchestrate the image upload flow.

- [`upload_image`](clothing_processor/main.md#upload_image)  
  Uploads and processes an image file, initiating the pipeline.  
  → [Parameters](clothing_processor/main.md#parameters) | [Throws](clothing_processor/main.md#throws)

---

### [Image Utilities](clothing_processor/utils/image.md)  
Functions for image manipulation, colour extraction, and background removal.

- [`to_image_array`](clothing_processor/utils/image.md#to_image_array)  
  Converts an uploaded image into a NumPy array for processing.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`remove_background`](clothing_processor/utils/image.md#remove_background)  
  Removes the background of an image to isolate the clothing item.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`to_base64`](clothing_processor/utils/image.md#to_base64)  
  Encodes an image array to a base64 string for transport/storage.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`get_rgb_colour`](clothing_processor/utils/image.md#get_rgb_colour)  
  Extracts the average RGB colour from the image.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`get_hex_colour`](clothing_processor/utils/image.md#get_hex_colour)  
  Converts RGB colour values to a hex colour code.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`rgb_to_hex`](clothing_processor/utils/image.md#rgb_to_hex)  
  Converts an RGB tuple into a hex string.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`hex_to_rgb`](clothing_processor/utils/image.md#hex_to_rgb)  
  Converts a hex string into an RGB tuple.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`calculate_distance`](clothing_processor/utils/image.md#calculate_distance)  
  Calculates the Euclidean distance between two RGB values for colour comparison.  
  → [Parameters](clothing_processor/utils/image.md#parameters) | [Throws](clothing_processor/utils/image.md#throws)

- [`match_colour`](clothing_processor/utils/image.md#match_colour)  
  Finds the closest matching colour from a predefined palette.  
  → [Parameters](clothing_processor/utils/image.md#parameters)

- [`get_colour`](clothing_processor/utils/image.md#get_colour)  
  Returns the matched colour from the image.  
  → [Parameters](clothing_processor/utils/image.md#parameters)

---

### [Predictions](clothing_processor/utils/predictions.md)  
Handles model loading and prediction logic using machine learning.

- [`load_model`](clothing_processor/utils/predictions.md#load_model)  
  Loads the machine learning model used for predictions.  
  → [Parameters](clothing_processor/utils/predictions.md#parameters) | [Throws](clothing_processor/utils/predictions.md#throws)

---

### [S3 Utilities](clothing_processor/utils/s3.md)  
Handles interactions with AWS S3 for file storage and retrieval.

- [`load_s3_client`](clothing_processor/utils/s3.md#load_s3_client)  
  Initializes an AWS S3 client using credentials.

- [`test_s3_connection`](clothing_processor/utils/s3.md#test_s3_connection)  
  Verifies that the S3 client is correctly authenticated.  
  → [Throws](clothing_processor/utils/s3.md#throws)

- [`s3_upload`](clothing_processor/utils/s3.md#s3_upload)  
  Uploads an image to a specified S3 bucket.  
  → [Parameters](clothing_processor/utils/s3.md#parameters) | [Throws](clothing_processor/utils/s3.md#throws)

---

### [File Utilities](clothing_processor/utils/files.md)  
Provides utility functions for handling file reading and transformation.

- [`get_image`](clothing_processor/utils/files.md#get_image)  
  Loads and decodes an image file from bytes.  
  → [Parameters](clothing_processor/utils/files.md#parameters) | [Throws](clothing_processor/utils/files.md#throws)

---

## Contents

```{toctree}
:maxdepth: 3
:caption: Contents:

index.md
clothing_processor/main.md
clothing_processor/utils/image.md
clothing_processor/utils/predictions.md
clothing_processor/utils/s3.md
clothing_processor/utils/files.md
