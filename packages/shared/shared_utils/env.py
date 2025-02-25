import dotenv
import os

# Caching environment variables
_env = None

def get_env():
  """Get environment variables with caching."""
  global _env
  if _env is None:
    dotenv.load_dotenv()
    _env = {
      "AUTH0_CLIENT_ID": os.getenv("AUTH0_CLIENT_ID"),
      "AUTH0_CLIENT_SECRET": os.getenv("AUTH0_CLIENT_SECRET"),
      "AUTH_TOKEN": os.getenv("AUTH_TOKEN"),
      "AUTH0_DOMAIN": os.getenv("AUTH0_DOMAIN"),
      "AUTH0_AUDIENCE":  os.getenv("AUTH0_AUDIENCE"),
      "AWS_ACCESS_KEY_ID": os.getenv("AWS_ACCESS_KEY_ID"),
      "AWS_SECRET_ACCESS_KEY": os.getenv("AWS_SECRET_ACCESS_KEY"),
      "AWS_DEFAULT_REGION": os.getenv("AWS_DEFAULT_REGION"),
      "AWS_URL": os.getenv("AWS_DEFAULT_REGION"),
    }
  return _env
