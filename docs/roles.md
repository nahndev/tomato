# Roles

A role belongs to exactly one department. Roles are defined per department; assigning them to users is not implemented yet.

## Model

| Table   | Content                                                                              |
| ------- | ------------------------------------------------------------------------------------ |
| `roles` | `department_id` (FK, cascade on delete), `name` (1–100 chars), unique per department |

## API

| Method | Path                                   | Notes              |
| ------ | -------------------------------------- | ------------------ |
| GET    | `/departments/:departmentId/roles`     | paginated `Role[]` |
| GET    | `/departments/:departmentId/roles/:id` | `Role`             |
| POST   | `/departments/:departmentId/roles`     | `{ name }`         |
| PATCH  | `/departments/:departmentId/roles/:id` | `{ name? }`        |
| DELETE | `/departments/:departmentId/roles/:id` | `204`              |

Validation errors → `400 VALIDATION_FAILED`; unknown department or role → `404 NOT_FOUND`; duplicate name in the department → `409 CONFLICT`.

## Web

- `modules/roles`: `/department/{slug}/roles` (search, add, edit, delete). `slug` = department id. Linked from the department sidebar.
