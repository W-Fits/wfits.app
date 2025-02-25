import json
import subprocess
from shared_utils.env import get_env

LAMBDA_NAME = "clothing-processor"

RESERVED_KEYS = {
  "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN",
  "AWS_DEFAULT_REGION", "AWS_REGION", "AWS_LAMBDA_FUNCTION_NAME"
}

def get_current_env():
  """Fetch current Lambda environment variables."""
  result = subprocess.run(
    ["aws", "lambda", "get-function-configuration", "--function-name", LAMBDA_NAME],
    capture_output=True,
    text=True
  )

  if result.returncode != 0:
    print("Error fetching current environment:", result.stderr)
    exit(1)
  
  config = json.loads(result.stdout)
  return config.get("Environment", {}).get("Variables", {})

def update_lambda_env(new_env):
  """Update Lambda function with new environment variables."""
  env_json = json.dumps({"Variables": new_env})
  
  result = subprocess.run(
    ["aws", "lambda", "update-function-configuration", 
      "--function-name", LAMBDA_NAME, 
      "--environment", env_json],
    capture_output=True,
    text=True
  )

  if result.returncode != 0:
    print("Error updating environment:", result.stderr)
    exit(1)
  
  print("Lambda environment updated successfully.")

def merge_env(current_env, new_env): 
  """Return the merged object of env"""
  return {**current_env, **new_env}

def filter_env(env): 
  """Return filtered env without reserved keys."""
  return {k: v for k, v in env.items() if k not in RESERVED_KEYS}


def main():
  new_env = get_env()
  filtered_env = filter_env(new_env)
  current_env = get_current_env()
  
  updated_env = merge_env(current_env, filtered_env)
  
  update_lambda_env(updated_env)

if __name__ == "__main__":
  main()