# Authorize

`apps/authorize` owns authorization. [SpiceDB](https://authzed.com/spicedb) (relationship-based, Zanzibar-style) is the engine; the app keeps its relationships in sync with the database through [CDC](cdc.md). No HTTP surface yet.

## Run

```bash
docker compose up -d        # postgres, kafka, debezium, spicedb
pnpm migrate
cp apps/authorize/.env.example apps/authorize/.env
pnpm --filter @tomato/authorize dev
```

Env (all required): `KAFKA_BROKERS` (comma-separated), `KAFKA_GROUP_ID`, `SPICEDB_ENDPOINT`, `SPICEDB_TOKEN` (must match `SPICEDB_GRPC_PRESHARED_KEY` in `docker-compose.yml`), `SPICEDB_INSECURE` (plaintext gRPC, `true` for local).

## Modules

- `modules/spicedb`: SpiceDB client. Writes the schema on start (`SPICEDB_SCHEMA`) and exposes `touchRelationships` (idempotent `TOUCH`).
- `modules/cdc`: Kafka microservice (`@nestjs/microservices`, started in `main.ts`) handling `tomato.public.users` and `tomato.public.documents` via `@EventPattern` in `cdc.controller.ts` (topics are auto-created by the broker/Debezium). `cdc.mapper.ts` turns a change event into relationships; at-least-once delivery is safe because writes are idempotent.

## Schema

```
user
department   member: user
document     department: department, owner: user
             view = owner + department->member, edit = owner
```

## Rules

Only inserts (`c`, and snapshot `r`) are handled.

| Event                | Relationships written                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| user added           | `department:<department_id>#member@user:<id>`                                 |
| document added       | `document:<id>#department@department:<department_id>`, `document:<id>#owner@user:<owner_id>` |

`documents` is expected to have the columns `id`, `department_id`, `owner_id`; the table does not exist yet (see [documents.md](documents.md)). A row missing a required column fails the consumer.

Updates and deletes (a user moving department, removed users and documents) are not synced yet.
