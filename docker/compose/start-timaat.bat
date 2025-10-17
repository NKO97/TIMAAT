@echo off
echo Starting TIMAAT...

where docker >nul 2>&1
if errorlevel 1 (
    echo A Docker runtime is required to start TIMAAT.
    exit /b 1
)

docker compose up