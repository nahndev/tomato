# Storage

`apps/storage` (NestJS + Prisma) stores files and folders for users and departments. It has its own PostgreSQL database, `storage`; file contents are saved on disk in `STORAGE_DIR`. There is no auth yet, like the rest of the backend.

## Data model

```
groups (type, uuid) 1:1 folders (root) 1:n folders (parent_id) 1:n files
```

- `groups`: one per `(type, uuid)`. `type` is `GroupType` (`user` or `department`), `uuid` is the id of that user or department, with no FK as they live in another database. `folder_id` is the root folder.
- `folders`: a tree through `parent_id`; only a root has `parent_id = null`.
- `files`: metadata; `object_id` is the name of the content on disk and is never returned by the API.

Deleting a folder deletes everything inside it, contents included. Deleting a group deletes its root folder.

## Seeding

Storage consumes the CDC topics `tomato.public.users` and `tomato.public.departments` ([cdc.md](cdc.md)) and creates a group on each `c` or `r` event. Seeding is idempotent, so events can be replayed.

- The consumer starts from the beginning of the topics, so existing users are seeded on first start. Users deleted since then still appear in the topic and also get a group.
- `d` events are ignored: deleting a user or department keeps its group and files.
- A group appears shortly after its user or department is created. Until then the file browser shows `loadFailed`.

## API

Prefix `/rest`, Swagger at `/rest/docs`. Web reaches it through the rewrite `/rest/storage/:path*`.

| Route | Purpose |
|---|---|
| `GET /groups?type&uuid` | List groups (paginated) |
| `POST /groups`, `PATCH /groups/:id`, `DELETE /groups/:id` | Manage groups; `POST` also creates the root folder |
| `GET /groups/:id` | The group with all its folders (root included) and files |
| `POST /folders`, `PATCH /folders/:id`, `DELETE /folders/:id` | Manage folders; `PATCH` renames or moves |
| `GET /folders/:id` | The folder with its direct subfolders and files |
| `POST /files` | Upload (multipart: `file`, `folderId`), up to `STORAGE_FILE_MAX_SIZE` |
| `GET /files/:id`, `PATCH /files/:id`, `DELETE /files/:id` | Manage files; `PATCH` renames or moves |
| `GET /files/:id/content` | Download; always `attachment` with `nosniff`, as it is served from the web origin |

Moves stay inside the group and a folder cannot move into itself or a descendant (`409 CONFLICT`). The root folder cannot be renamed, moved or deleted directly (`409 CONFLICT`).

`experimental.proxyClientMaxBodySize` in `apps/web/next.config.ts` follows `STORAGE_FILE_MAX_SIZE`: rewrites fail on bodies over 10 MB by default.

## Setup

```bash
docker compose up -d
cp apps/storage/.env.example apps/storage/.env
pnpm --filter @tomato/storage migrate:deploy
```

Kafka must be reachable: the service refuses to start without it. On an existing Postgres volume, first run `docker compose exec postgres psql -U tomato -d tomato -c 'CREATE DATABASE storage'`, then see [cdc.md](cdc.md) to capture `public.departments`.
