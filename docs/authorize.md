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

- `modules/spicedb`: SpiceDB client. Writes the schema on start (read from `schema.zed`, copied to `dist` by `nest-cli.json` assets) and exposes `writeRelationships` (idempotent `TOUCH` and `DELETE` in one write).
- `modules/cdc`: Kafka microservice (`@nestjs/microservices`, started in `main.ts`) handling `tomato.public.users`, `tomato.public.documents` and `tomato.public.role_permissions` via `@EventPattern` in `cdc.controller.ts` (topics are created on start by `ensureCdcTopics` if missing: Debezium only creates a topic once its table exists). The controller hands each event to `RelationshipSyncService` with its `CdcTable`; the service asks the table's `RelationshipMapper` whether it handles the operation (`supports(op)`: `users` and `documents` inserts only, `role_permissions` every change), maps the `before`/`after` rows to relationships and calls `RelationshipService`. At-least-once delivery is safe because writes are idempotent.
- `modules/mapper`: stateless `RelationshipMapper`s, one per table (`UserMapper`, `DocumentMapper`, `RolePermissionMapper`), each with `supports(op)` and `toRelationships(row)` (validates the row and maps it to relationships). `RelationshipMapperRegistry.get(table)` returns the mapper of a `CdcTable`. To support a new table, add a mapper, a `CdcTable`, an entry in the registry and a controller route.
- `modules/relationship`: `RelationshipService.replace(before, after)` writes the relationships of `after` and removes those of `before` that `after` no longer has.

## Schema

[schema.zed](../apps/authorize/src/modules/spicedb/schema.zed) defines the object types and permissions (`view = owner + department->member`, `edit = owner`; role-based `document#read/update/delete` and `department#create_document`, see [permissions.md](permissions.md)). Relationships are data written by CDC. Removing a relation that still has relationships is rejected by SpiceDB: delete them first.

## Rules

`users` and `documents`: only inserts (`c`, and snapshot `r`) are handled. `role_permissions`: every change, as the diff of the old and new row.

| Event               | Relationships written                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| user added          | `department:<department_id>#member@user:<id>`                                                                                            |
| document added      | `document:<id>#department@department:<department_id>`, `document:<id>#owner@user:<owner_id>`                                             |
| role permission set | per enabled action: `department:<department_id>#<resource>_<action>@role:<role_id>#member`; revoked actions and deleted rows are removed |

`documents` is expected to have the columns `id`, `department_id`, `owner_id`; the table does not exist yet (see [documents.md](documents.md)). A row missing a required column fails the consumer.

Updates and deletes of users and documents (a user moving department, removed users and documents) are not synced yet. Users are not yet members of a role (`role#member`), so granted permissions take effect once role assignment exists.
