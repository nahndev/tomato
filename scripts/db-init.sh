#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

docker compose up -d --wait --force-recreate postgres
docker compose exec -T postgres psql -U tomato -d tomato < docker/postgres/init.sql
