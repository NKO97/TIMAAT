#!/usr/bin/env bash

echo Starting TIMAAT
docker -v  >/dev/null 2>&1 || { echo >&2 "A docker runtime is required to start TIMAAT."; exit 1; }

docker compose up