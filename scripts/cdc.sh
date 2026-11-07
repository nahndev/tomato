#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

CONNECTOR_CONFIG="docker/debezium/tomato-connector.json"
CONNECTOR_URL="http://localhost:8083/connectors/tomato-postgres"
SIGNAL_TABLE="public.debezium_signal"

usage() {
  cat <<USAGE
Usage: scripts/cdc.sh <command>

  status                     Show the connector status
  register                   Create or update the connector from its config
  snapshot [table...]        Replay existing rows as "r" events
  stop-snapshot [table...]   Stop a running incremental snapshot

Tables default to every captured table, e.g. users or public.users.
USAGE
}

captured_tables() {
  node -p "require('./$CONNECTOR_CONFIG')['table.include.list']" \
    | tr ',' '\n' \
    | grep -vx "$SIGNAL_TABLE"
}

send_signal() {
  local type="$1" collections="" table
  shift

  if [[ $# -eq 0 ]]; then
    local captured
    captured="$(captured_tables)"
    mapfile -t tables <<<"$captured"
    set -- "${tables[@]}"
  fi

  for table in "$@"; do
    table="${table#public.}"
    if [[ ! "$table" =~ ^[a-z_][a-z0-9_]*$ ]]; then
      echo "Invalid table name: $table" >&2
      exit 1
    fi
    collections+="${collections:+,}\"public.$table\""
  done

  docker compose exec -T postgres psql -U tomato -d tomato -v ON_ERROR_STOP=1 -c \
    "INSERT INTO debezium_signal (id, type, data) VALUES (gen_random_uuid()::text, '$type', '{\"data-collections\": [$collections], \"type\": \"incremental\"}');"
}

command="${1:-}"
shift || true

case "$command" in
  status)
    curl -fsS "$CONNECTOR_URL/status"
    echo
    ;;
  register)
    curl -fsS -X PUT -H 'Content-Type: application/json' \
      --data "@$CONNECTOR_CONFIG" "$CONNECTOR_URL/config"
    echo
    ;;
  snapshot)
    send_signal execute-snapshot "$@"
    ;;
  stop-snapshot)
    send_signal stop-snapshot "$@"
    ;;
  -h | --help | help)
    usage
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac
