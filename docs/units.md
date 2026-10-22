# Units

A unit is a named organisation node (client, department, office, team, …) with a type.

## Model

| Table        | Content                                                                              |
| ------------ | ------------------------------------------------------------------------------------ |
| `unit_types` | `name` (unique), `is_default`; seeded with `client`, `department`, `office`, `team`  |
| `units`      | `name`, `is_system`, `type_id` (restrict); seeded with one system unit `Client`      |

- The **system unit** (`is_system`) is the client. It can be renamed, but not deleted or moved to another type. The API never creates another system unit.
- **Default types** (`is_default`) cannot be renamed or deleted. Custom types can, as long as no unit uses them.
- `ClientService.load()` (`UnitsModule`) returns the system unit.

## API

| Method | Path              | Notes                                                              |
| ------ | ----------------- | ------------------------------------------------------------------ |
| GET    | `/units`          | paginated `Unit[]` (system unit first)                             |
| GET    | `/units/:id`      | `Unit`                                                             |
| POST   | `/units`          | `{ name, typeId }`                                                 |
| PATCH  | `/units/:id`      | partial; the system unit keeps its type                            |
| DELETE | `/units/:id`      | `204`; the system unit cannot be deleted                           |
| GET    | `/unit-types`     | `UnitType[]` (defaults first)                                      |
| POST   | `/unit-types`     | `{ name }`                                                         |
| PATCH  | `/unit-types/:id` | `{ name }`; default types are locked                               |
| DELETE | `/unit-types/:id` | `204`; default types are locked                                    |

Validation errors / unknown `typeId` → `400 VALIDATION_FAILED`; unknown ids → `404 NOT_FOUND`; touching the system unit or a default type → `403 FORBIDDEN`; duplicate type name or deleting a type in use → `409 CONFLICT`.

## Web

- `modules/unit`: `/workspace/units` with two tabs: **Units** (search, create, edit, delete) and **Types** (create, rename, delete). Listed in the workspace sidebar.
