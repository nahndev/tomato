# CDC (change data capture)

PostgreSQL changes are streamed to Kafka by Debezium; `apps/authorize` consumes them to keep SpiceDB in sync (see [authorize.md](authorize.md)).

```
postgres (wal_level=logical) → debezium (Kafka Connect) → kafka → apps/authorize → spicedb
```

## Setup

`docker compose up -d` starts everything (`postgres`, `kafka`, `debezium`, `debezium-setup`, `spicedb-migrate`, `spicedb`).

### PostgreSQL

[docker/postgres/init.sql](../docker/postgres/init.sql) runs on first start of the data volume:

- the `postgres` service runs with `wal_level=logical` (set in `docker-compose.yml`)
- role `debezium` (`LOGIN REPLICATION`, `SELECT` on `public`, including future tables)
- publication `tomato_cdc` (`FOR ALL TABLES`, so tables added later are captured without changes)
- database `spicedb` (SpiceDB datastore)

Existing volume (init scripts do not rerun): recreate the container so `wal_level` applies, then run the script by hand (ignore the "already exists" errors):

```bash
docker compose up -d --force-recreate postgres
docker compose exec -T postgres psql -U tomato -d tomato < docker/postgres/init.sql
```

### Kafka and Debezium

- `kafka`: single-node KRaft broker. In-network `kafka:9092`, from the host `localhost:29092`.
- `debezium`: Kafka Connect with the PostgreSQL connector, REST API at `http://localhost:8083`.
- `debezium-setup`: registers the connector `tomato-postgres` from [docker/debezium/tomato-connector.json](../docker/debezium/tomato-connector.json) (idempotent). Manually:

```bash
curl -X PUT -H 'Content-Type: application/json' \
  --data @docker/debezium/tomato-connector.json \
  http://localhost:8083/connectors/tomato-postgres/config
curl http://localhost:8083/connectors/tomato-postgres/status
```

## Topics

`tomato.public.<table>` for `users`, `documents` and `role_permissions` (`table.include.list`). Values are plain JSON (no schema envelope): `{ "before", "after", "op", "source", ... }` with `snake_case` column names. `op`: `r` snapshot read, `c` create, `u` update, `d` delete. The initial snapshot replays existing rows as `r`.

To capture another table, add it to `table.include.list` and re-register the connector.

## Incremental snapshot

Re-reads existing rows as `r` events without stopping streaming (e.g. after adding a table or fixing a consumer bug). Signals are rows inserted into `public.debezium_signal` (Prisma model `DebeziumSignal`, in `table.include.list` and `signal.data.collection`; the `debezium` role is granted write access by the migration). Tables need a primary key.

```sql
INSERT INTO debezium_signal (id, type, data) VALUES (
  gen_random_uuid()::text,
  'execute-snapshot',
  '{"data-collections": ["public.users"], "type": "incremental"}'
);
```

Stop it with `type = 'stop-snapshot'` and the same `data`. `authorize` handles replayed rows idempotently.
