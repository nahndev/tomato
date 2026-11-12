# Add Roles feature

## Currently

- The `roles` module structure exists in api and web (see `docs/roles.md`), but has no behaviour: no endpoints, no entity, and `/department/{slug}/roles` is an empty page.
- There is no way to define roles for a department or to assign them to its users.

## Acceptance Criteria

- [x] Add Roles menu for department system

## Solutions

- [x] Add `RolePage` and `crud` action with tanstackQuery
- [x] Add CRUD endpoints for Role
- [x] Add prisma entity for role
