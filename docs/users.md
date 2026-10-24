# Users

A user belongs to exactly one department.

## Model

| Table   | Content                                                                                |
| ------- | -------------------------------------------------------------------------------------- |
| `users` | `department_id` (FK, cascade on delete), `name` (1–100 chars), `email` (unique, ≤ 254) |

Emails are trimmed and lower-cased before validation.

## API

| Method | Path                                   | Notes               |
| ------ | -------------------------------------- | ------------------- |
| GET    | `/departments/:departmentId/users`     | paginated `User[]`  |
| GET    | `/departments/:departmentId/users/:id` | `User`              |
| POST   | `/departments/:departmentId/users`     | `{ name, email }`   |
| PATCH  | `/departments/:departmentId/users/:id` | `{ name?, email? }` |
| DELETE | `/departments/:departmentId/users/:id` | `204`               |

Validation errors → `400 VALIDATION_FAILED`; unknown department or user → `404 NOT_FOUND`; duplicate email → `409 CONFLICT`.

## Web

- `modules/user`: `/department/{slug}/user` (search, add, edit, delete). `slug` = department id.
