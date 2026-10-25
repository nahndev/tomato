# Documents

A document belongs to exactly one department and has an owner (a user of that department). Inserts are synced to SpiceDB by the `authorize` app via CDC (`department`, `owner` relations, see [authorize.md](authorize.md)). The API does not check permissions yet; what a role may do is set in [permissions.md](permissions.md).

## Model

| Table       | Content                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `documents` | `department_id` (FK, cascade on delete), `owner_id` (user id, no FK), `title` (1–100 chars), `content` (text, ≤ 100 000 chars) |

## API

| Method | Path                                       | Notes                                |
| ------ | ------------------------------------------ | ------------------------------------ |
| GET    | `/departments/:departmentId/documents`     | paginated `Document[]`               |
| GET    | `/departments/:departmentId/documents/:id` | `Document`                           |
| POST   | `/departments/:departmentId/documents`     | `{ title, content?, ownerId }`       |
| PATCH  | `/departments/:departmentId/documents/:id` | `{ title?, content? }` (owner fixed) |
| DELETE | `/departments/:departmentId/documents/:id` | `204`                                |

Validation errors → `400 VALIDATION_FAILED`; unknown department, document, or owner outside the department → `404 NOT_FOUND`.

## Web

- `modules/documents`: `/department/{slug}/documents` (search, add, edit, delete). `slug` = department id. Linked from the department sidebar. The owner is picked from the department users when adding and cannot be changed afterwards.
