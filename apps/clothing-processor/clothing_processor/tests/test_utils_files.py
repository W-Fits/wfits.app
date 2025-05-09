import pytest
import numpy as np
from fastapi import UploadFile
from starlette.datastructures import UploadFile as StarletteUploadFile
from PIL import Image
import io

from clothing_processor.utils.files import (
  valid_file_type,
  get_image,
)

# Create mock Image UploadFile without actual image data to test the functions with
def create_upload_file(filename: str, content: bytes = b'fake image content') -> UploadFile:
    return StarletteUploadFile(filename=filename, file=io.BytesIO(content))

# valid_file_type() Tests
def test_valid_file_type_valid_file():
  file = create_upload_file('testImage.jpg')
  assert valid_file_type(file) == True

def test_valid_file_type_invalid_file():
  file = create_upload_file('testImage.txt')
  assert valid_file_type(file) == False

def test_valid_file_type_none_input():
  with pytest.raises(ValueError, match='Input file is None.'):
    valid_file_type(None)

def test_valid_file_type_empty_exstension():
  file = create_upload_file('testImage')
  assert valid_file_type(file) == False


# Create mock Image UploadFile with real image data to test the functions with
def create_image_upload_file(filename: str):
    img = Image.new('RGB', (10, 10), color='red')
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return StarletteUploadFile(filename=filename, file=buf)

# get_image() Tests
@pytest.mark.asyncio
async def test_get_image_valid_image():
  file = create_image_upload_file('testImage.png')
  image = await get_image(file)
  assert isinstance(image, Image.Image)

@pytest.mark.asyncio
async def test_get_image_invalid_type():
    file = create_upload_file('testImage.txt')
    with pytest.raises(ValueError, match='Invalid file type'):
        await get_image(file)

@pytest.mark.asyncio
async def test_get_image_invalid_image_content():
    file = create_upload_file('testImage.png')
    with pytest.raises(ValueError, match='Error while processing image:'):
        await get_image(file)