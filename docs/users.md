# Users

A user belongs to exactly one department.

## Model

| Table            | Content                                                                                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`          | `department_id` (FK, cascade on delete), `eid` (optional, ≤ 50, unique per department), `name` (1–100 chars), `family_name`, `email` (unique, ≤ 254), `tel`, `avatar_file_id` |
| `user_addresses` | `user_id` (FK, cascade on delete), `street`, `city`, `postal_code`, `country`, `position` (at most 10 per user; the first is shown as the user's address)                              |
| `user_roles`     | `user_id`, `role_id` (composite PK, FKs, cascade on delete), synced to SpiceDB as `role#member` (see [authorize.md](authorize.md))                                                      |

Emails are trimmed and lower-cased before validation.

## API

| Method | Path                                   | Notes               |
| ------ | -------------------------------------- | ------------------- |
| GET    | `/departments/:departmentId/users`     | paginated `User[]`  |
| GET    | `/departments/:departmentId/users/:id` | `User`              |
| POST   | `/departments/:departmentId/users`     | `{ name, email }`   |
| PATCH  | `/departments/:departmentId/users/:id` | `{ eid?, name?, familyName?, email?, tel?, addresses?, roleIds? }`; `addresses` and `roleIds` replace the current list |
| DELETE | `/departments/:departmentId/users/:id` | `204`               |
| PUT    | `/departments/:departmentId/users/:id/avatar` | `{ fileId }`, a file of the [storage service](storage.md); `User` |

Validation errors → `400 VALIDATION_FAILED`; unknown department, user, or role of another department → `404 NOT_FOUND`; duplicate email or EID → `409 CONFLICT`.

The api checks the file against the storage service at `STORAGE_URL` (required env) and keeps only its id; web loads the image from the storage service. Deleting the file removes the avatar. An unknown `fileId` → `404 NOT_FOUND`; storage unreachable → `502`. Avatars are PNG, JPEG or WebP up to 5 MB (`413 VALIDATION_FAILED` above that). The type is detected from the file's bytes.

## Web

- `modules/user`: `/department/{slug}/user` (search, add, edit, delete). `slug` = department id. `New user` creates a user with a default name and generated email, then opens its drawer. The drawer follows the `?user=<id>` query, so it can be linked to and reopened from the URL. Clicking a row opens the same drawer, with `Information` (profile panel and a form that auto-saves after 800 ms when valid, and when the drawer closes) and `Credential` (empty for now).
