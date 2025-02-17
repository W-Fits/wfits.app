from fastapi import UploadFile
from PIL import Image
import io

def valid_file_type(file: UploadFile):
  """Checks if the uploaded file is a valid image based on its extension -> bool."""
  valid_extensions = ['jpg', 'jpeg', 'png']
  file_extension = file.filename.split(".")[-1].lower()
  return file_extension in valid_extensions


async def get_image(file: UploadFile):
  """Reads and processes an uploaded image -> ImageFile."""
  if not valid_file_type(file):
    raise ValueError(f"Invalid file type: {file.filename}. Please upload a valid image file.")
  
  try:
    content = await file.read()
    content_bytes = io.BytesIO(content)
    content_image = Image.open(content_bytes)
  except Exception as e:
    raise ValueError(f"Error while processing image: {e}")
  
  return content_image