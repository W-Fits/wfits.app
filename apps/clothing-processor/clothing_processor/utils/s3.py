import boto3
from dotenv import load_dotenv
import uuid
from PIL import Image
from clothing_processor.utils.image import to_bytes_image

# Load .env for `boto3`
load_dotenv()

# Cache the instance s3
_s3 = None

BUCKET_NAME = "wfits-bucket"

def load_s3_client():
  """
  Load and return the S3 client.

  :return: The S3 client.
  :rtype: boto3.client
  """
  global _s3
  if _s3 is None:
    _s3 = boto3.client('s3')
  return _s3


def test_s3_connection():
  """
  Test connection to a specific S3 bucket to check if the credentials are correct.

  :raise Exception: If there is an issue with the connection or AWS credentials.
  :return: None
  :rtype: None
  """
  try:
    # Initialize the S3 resource with boto3
    s3 = load_s3_client()

    # Try to access the specified bucket
    s3.meta.client.head_bucket(Bucket=BUCKET_NAME)

    print(f"Connection successful! You have access to the bucket: {BUCKET_NAME}")
  except s3.exceptions.NoCredentialsError:
    print("Error: No valid AWS credentials found.")
  except s3.exceptions.PartialCredentialsError:
    print("Error: Incomplete AWS credentials provided.")
  except s3.exceptions.S3UploadFailedError:
    print("Error: Upload failed. Check your bucket permissions.")
  except Exception as e:
    print(f"Error: {e}")

def s3_upload(image: Image.Image) -> str:
  """
  Uploads a PIL Image to S3 and returns the image's S3 URL.

  :param image: The PIL Image to upload.
  :type image: Image.Image
  :raise ValueError: If the upload fails due to an error.
  :return: The S3 URL of the uploaded image.
  :rtype: str
  """
  try:
    # Initialize the S3 client
    s3 = load_s3_client()

    file_name = str(uuid.uuid4()) + ".png"
    
    bytes_image = to_bytes_image(image)

    # Upload the image to the specified bucket
    s3.upload_fileobj(
      bytes_image,
      "wfits-bucket",
      file_name,
      ExtraArgs={
        "ContentType": "image/png",
        "ContentDisposition": "inline"
      }
    )

    s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"

    return s3_url
  
  except Exception as e:
    raise ValueError(f"Failed to upload file: {e}")
