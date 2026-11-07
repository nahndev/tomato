#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

copy_env() {
  if [[ -e "$2" ]]; then
    echo "Keeping $2"
  else
    cp "$1" "$2"
    echo "Created $2"
  fi
}

pnpm install

for example in apps/*/.env.example; do
  dir="$(dirname "$example")"
  if [[ "$dir" == "apps/web" ]]; then
    copy_env "$example" "$dir/.env.local"
  else
    copy_env "$example" "$dir/.env"
  fi
done

docker compose up -d
docker compose up -d --wait postgres

pnpm --filter @tomato/api migrate:deploy
pnpm --filter @tomato/storage migrate:deploy

echo "Done. Set GEMINI_AI_KEY in apps/copilot/.env if it is empty, then run: pnpm dev"
