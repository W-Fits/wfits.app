#!/bin/bash

CONTAINER_NAME="wfits-postgres"

echo "Stopping PostgreSQL container: $CONTAINER_NAME..."
docker stop $CONTAINER_NAME

if [ $? -eq 0 ]; then
  echo "Database container stopped successfully."
else
  echo "Failed to stop the container."
fi