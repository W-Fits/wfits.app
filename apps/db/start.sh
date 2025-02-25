#!/bin/bash

# Import env variables from .env
set -a
source .env
set +a

# Ensure Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Install it and try again."
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Install it and try again."
  exit 1
fi

# Start the PostgreSQL container
echo "Starting PostgreSQL using Docker Compose..."
docker-compose up -d

# Wait for the PostgreSQL container to be fully running
echo "Waiting for PostgreSQL to be ready..."
# Choose the correct container name - either mydb-postgres or wfits-postgres
until docker exec wfits-postgres pg_isready -U "${POSTGRES_USER}"; do
  sleep 2
done

echo "PostgreSQL is ready."

# Choose ONE migration method:

# Option 1: Apply latest migration file directly
LATEST_MIGRATION=$(ls -v migrations/*.sql | tail -n 1)
if [ -n "$LATEST_MIGRATION" ]; then
  echo "Applying latest migration: $LATEST_MIGRATION"
  cat "$LATEST_MIGRATION" | docker exec -i wfits-postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
  echo "Migration applied successfully!"
else
  echo "No migration files found!"
fi

echo "Setup complete!"