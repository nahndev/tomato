# Storage

`apps/storage` (NestJS + Prisma) stores files and folders for users and departments. It has its own PostgreSQL database, `storage`; file contents are saved on disk in `STORAGE_DIR`. There is no auth yet, like the rest of the backend.

## Data model

```
groups (type, uuid) 1:1 folders (root) 1:n folders (parent_id) 1:n files
```

- `groups`: one per `(type, uuid)`. `type` is `GroupType` (`user` or `department`), `uuid` is the id of that user or department, with no FK as they live in another database. `label` is the name of that user or department. `folder_id` is the root folder.
- `folders`: a tree through `parent_id`; only a root has `parent_id = null`.
- `files`: metadata; `object_id` is the name of the content on disk and is never returned by the API.

Deleting a folder deletes everything inside it, contents included.

## Seeding

Groups are only written from CDC, there is no API to change them. Storage consumes the topics `tomato.public.users` and `tomato.public.departments` ([cdc.md](cdc.md)) and upserts a group on each `c`, `r` or `u` event, so `label` follows renames. This is idempotent, so events can be replayed.

- The consumer starts from the beginning of the topics, so existing users are seeded on first start. Users deleted since then still appear in the topic and also get a group.
- `d` events are ignored: deleting a user or department keeps its group and files.
- A group appears shortly after its user or department is created. Until then the file browser shows `loadFailed` if the owner has no other group.
- Groups created before `label` existed have an empty label until an [incremental snapshot](cdc.md#incremental-snapshot) of `public.users` and `public.departments` replays them.

## API

Prefix `/rest`, Swagger at `/rest/docs`. Web reaches it through the rewrite `/rest/storage/:path*`.

| Route | Purpose |
|---|---|
| `GET /groups?limit` | List groups (paginated, users first), each with its `label` and root `folder` |
| `POST /folders`, `PATCH /folders/:id`, `DELETE /folders/:id` | Manage folders; `PATCH` renames or moves |
| `GET /folders/:id` | The folder with its direct subfolders (`children`) and `files` |
| `GET /folders/:id/tree` | Every folder (itself included) and file under the folder |
| `POST /files` | Upload (multipart: `file`, `folderId`), up to `STORAGE_FILE_MAX_SIZE` |
| `GET /files?ids` | Several files by id (comma-separated, up to 100); unknown ids are left out |
| `GET /files/:id`, `PATCH /files/:id`, `DELETE /files/:id` | Manage files; `PATCH` renames or moves |
| `GET /files/:id/content?variant` | Download; always `attachment` with `nosniff`, as it is served from the web origin. `variant` (`small`, `medium`) asks for a scaled copy of an image |

Image scaling: uploading a PNG, JPEG or WebP (`SCALABLE_IMAGE_TYPES`) emits `ImageUploadedEvent` (`@tomato/events`); `ImageVariantsListener` has `ImageVariantsService` scale the original with `sharp` into one WebP per `ImageVariant` (`@tomato/constants`), fitted inside `IMAGE_VARIANT_SIZES` (`small` 128 px, `medium` 512 px), never enlarged and rotated by its EXIF orientation. Copies are stored next to the original as `<objectId>.<variant>` and removed with it. `?variant` serves the copy as `image/webp`; until it exists (an upload in progress, a file uploaded before scaling, or a file that is not a scalable image) the original is served, and a missing copy of an image is generated in the background. A failed scaling is only logged.

Caching: file metadata (`GET /files`, `GET /files/:id`) is sent with `Cache-Control: private, no-cache` and revalidated through the ETag Express adds (`304` when unchanged). `GET /files/:id/content` is `private, max-age=31536000, immutable` on success only, as the content of a file id never changes; an original served in place of a copy that is not ready yet is `private, no-cache` instead, so the browser asks again later; a renamed file keeps its old download name until the browser cache expires.

`limit` is a JSON `Prisma.GroupWhereInput`, restricted to `type` and `uuid` (a value, or `equals`, `in`, `notIn`, `not`) and `AND`, `OR`, `NOT`, up to 5 levels deep. Anything else returns `400 VALIDATION_FAILED`. Empty or `null` lists every group; `{ "OR": [] }` lists none.

Moves stay inside the group and a folder cannot move into itself or a descendant (`409 CONFLICT`). The root folder cannot be renamed, moved or deleted directly (`409 CONFLICT`).

`experimental.proxyClientMaxBodySize` in `apps/web/next.config.ts` follows `STORAGE_FILE_MAX_SIZE`: rewrites fail on bodies over 10 MB by default.

## Setup

```bash
docker compose up -d
cp apps/storage/.env.example apps/storage/.env
pnpm --filter @tomato/storage migrate:deploy
```

The HTTP API starts without Kafka; the CDC consumer connects in the background, retrying `KAFKA_RETRIES` times (`Infinity` to never give up, `0` to give up at once, e.g. in dev), so groups only sync once it is connected. On an existing Postgres volume, first run `docker compose exec postgres psql -U tomato -d tomato -c 'CREATE DATABASE storage'`, then see [cdc.md](cdc.md) to capture `public.departments`.
