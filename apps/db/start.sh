#!/bin/bash

# Import env variables from .env
set -a
source .env
set +a

# Ensure Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Install it and try again."
  exit 1
fi

# Start the PostgreSQL container
echo "Starting PostgreSQL using Docker Compose..."
docker-compose up -d

# Wait for the PostgreSQL container to be fully running
echo "Waiting for PostgreSQL to be ready..."
until docker exec wfits-postgres pg_isready -U "${POSTGRES_USER}"; do
  sleep 2
done

echo "PostgreSQL is ready!"