# Departments

A department is a named organisation node.

## Model

| Table         | Content                          |
| ------------- | -------------------------------- |
| `departments` | `name` (1–100 chars, `@IsName()`) |

## API

| Method | Path               | Notes                    |
| ------ | ------------------ | ------------------------ |
| GET    | `/departments`     | paginated `Department[]` |
| GET    | `/departments/:id` | `Department`             |
| POST   | `/departments`     | `{ name }`               |
| PATCH  | `/departments/:id` | `{ name }`               |
| DELETE | `/departments/:id` | `204`                    |

Validation errors → `400 VALIDATION_FAILED`; unknown ids → `404 NOT_FOUND`.

## Web

- `modules/department`: `/workspace/departments` (search, create, edit, delete). Listed in the workspace sidebar.
