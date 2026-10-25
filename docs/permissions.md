# Permissions

A role is granted create / read / update / delete on a resource. Permissions are defined per role of a department and synced to SpiceDB through [CDC](cdc.md) (see [authorize.md](authorize.md)).

Resources: `PermissionResource` in `@tomato/constants` (only `document` for now). To add one, extend the constant and the department relations / resource permissions in `schema.zed`.

## Model

| Table              | Content                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `role_permissions` | `department_id`, `role_id` (FKs, cascade on delete), `resource`, `can_create`, `can_read`, `can_update`, `can_delete` |

Unique per (`role_id`, `resource`). `REPLICA IDENTITY FULL`, so update/delete change events carry the old row.

## API

| Method | Path                                         | Notes                                                                |
| ------ | -------------------------------------------- | -------------------------------------------------------------------- |
| GET    | `/departments/:departmentId/permissions`     | paginated `RolePermission[]`, optional `?roleId=`                    |
| GET    | `/departments/:departmentId/permissions/:id` | `RolePermission`                                                     |
| POST   | `/departments/:departmentId/permissions`     | `{ roleId, resource, canCreate?, canRead?, canUpdate?, canDelete? }` |
| PATCH  | `/departments/:departmentId/permissions/:id` | `{ canCreate?, canRead?, canUpdate?, canDelete? }`                   |
| DELETE | `/departments/:departmentId/permissions/:id` | `204`                                                                |

Validation errors → `400 VALIDATION_FAILED`; unknown department, permission, or role of another department → `404 NOT_FOUND`; second permission for the same role and resource → `409 CONFLICT`.

## Web

- `modules/permissions`: `/department/{slug}/permissions`. One card per role with a resource × action checkbox grid. Ticking creates the row, unticking the last action deletes it. Linked from the department sidebar.
