@echo off
if not exist .env copy .env.example .env
docker compose up --build -d
echo OGA International app is starting on http://localhost:8080
pause
