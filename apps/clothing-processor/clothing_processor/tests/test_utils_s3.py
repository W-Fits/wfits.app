import pytest
from unittest.mock import patch, MagicMock
from PIL import Image
from io import BytesIO

from clothing_processor.utils import s3
from clothing_processor.utils.s3 import (
  load_s3_client,
  test_s3_connection,
  s3_upload,
)

@pytest.fixture
def fake_image():
    return Image.new("RGB", (10, 10))

# load_s3_client() Test
@patch("clothing_processor.utils.s3.boto3.client")
def test_load_s3_client(mock_boto_client):
    s3._s3 = None  # Reset cache so that mock is used
    client = load_s3_client()
    assert client == mock_boto_client.return_value
    mock_boto_client.assert_called_once_with("s3")

# test_s3_connection() Test
@patch("clothing_processor.utils.s3.load_s3_client")
def test_s3_connection(mock_load_client):
    mock_s3 = MagicMock()
    mock_s3.meta.client.head_bucket.return_value = {}
    mock_load_client.return_value = mock_s3
    s3.test_s3_connection()
    mock_s3.meta.client.head_bucket.assert_called_once_with(Bucket="wfits-bucket")

# s3_upload() Tests
@patch("clothing_processor.utils.s3.to_bytes_image")
@patch("clothing_processor.utils.s3.load_s3_client")
def test_s3_upload_success(mock_load_client, mock_to_bytes, fake_image):
    mock_s3 = MagicMock()
    mock_load_client.return_value = mock_s3
    mock_to_bytes.return_value = BytesIO(b"fake image data")
    url = s3_upload(fake_image)
    assert url.startswith("https://wfits-bucket.s3.amazonaws.com/")
    mock_s3.upload_fileobj.assert_called_once()

@patch("clothing_processor.utils.s3.to_bytes_image")
@patch("clothing_processor.utils.s3.load_s3_client")
def test_s3_upload_failure(mock_load_client, mock_to_bytes, fake_image):
    mock_s3 = MagicMock()
    mock_load_client.return_value = mock_s3
    mock_to_bytes.side_effect = Exception("Broken image")
    with pytest.raises(ValueError, match="Failed to upload file: Broken image"):
        s3_upload(fake_image)