# Standardize storage service

## Currently

- `apps/storage` was added in one commit (`6fa35e9`) by copying the shape of `apps/api`, and it has drifted from `apps/api` and from `CONTRIBUTING.md`.
- Layout differs from `apps/api`:
  - The exception filter is at `common/http-exception.filter.ts`, not `common/filters/`.
  - The env schema is at `src/config.schema.ts`, not `src/config/`.
- Route rule: the global prefix uses the constant `GLOBAL_PREFIX = 'rest'`, but constants for route names are not allowed. `apps/api` passes an inline `'api'`, so the two prefixes also differ.
- Errors:
  - Every error is a bare Nest exception (`NotFoundException`, `ConflictException`, `BadRequestException`), but custom errors are required. `apps/api` does the same, so it has no pattern to copy.
  - `@tomato/constants` has only generic error codes. A cross-group move, a folder cycle and a duplicate group all return `CONFLICT`, so clients cannot tell them apart.
  - `HttpStatusErrorCode` has no `UNAUTHORIZED` or `FORBIDDEN` entry, unlike `apps/api`. A 401 or 403 would return `INTERNAL_ERROR`.
  - A too-large upload returns `VALIDATION_FAILED`.
- Layering:
  - `GroupsService.update` catches Prisma errors because `GroupsRepository.update` lets them through. The files and folders repositories return `null` instead, and no other service in `apps/storage` or `apps/api` imports the Prisma error helpers.
  - `FilesController.getContent` builds the `Content-Disposition` value, which is logic in a controller.
  - `FilesService.create` checks the missing file and the name length by hand, outside the DTO.
- Duplication:
  - The Kafka topic names are in both `CDC_TOPICS` and the `@EventPattern` literals in `CdcController`.
  - `validation.pipe.ts` and `pagination-query.dto.ts` are identical in `apps/api` and `apps/storage`, and the exception filter differs only by an import path.
- Tests: `GroupsService` has no spec, while the files, folders and CDC services do.

## Acceptance Criteria

- [x] Remove all endpoints of `groups`, keep GET /rest/groups
- [x] GET /rest/groups support queries `type` and `uuid` return list `group`
- [x] GET /rest/groups return include rootFolder of group

- [x] The `ResourceContent` accept `rootFolder` and working base on this
- [x] The `FileBrowser` should don't include prop `group`
- [x] Using `apiClient` instead of `storageClient`

## Solutions

- [x] `GET /folders/:id/tree` replaces `GET /groups/:id` as the source of the tree; `GET /groups` returns only the metadata of `rootFolder`
- [x] Groups get a `label` column, written from CDC: `c`, `r` and `u` events upsert the group, so the label follows renames
  - Existing groups keep an empty label until an incremental snapshot of `public.users` and `public.departments`
- [x] `FileBrowser` loads the groups itself and passes the clicked group's `rootFolder` to `ResourceContent`
  - It takes `owners: { type, uuid }[]`, so the avatar picker still lists only the user and their department
- [x] `createStorageApi(apiClient, "/rest/storage")` sets `baseURL` per request, because `apiClient` points to `apps/api`
