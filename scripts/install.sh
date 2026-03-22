#!/usr/bin/env bash
set -e
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Please install Docker Desktop or Docker Engine first."
  exit 1
fi
cp -n .env.example .env || true
docker compose up --build -d
echo "OGA International app is starting on http://localhost:8080"
