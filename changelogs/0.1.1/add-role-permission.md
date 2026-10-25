# Add role-permission feature for department system

## Currently

- Departments can define roles (CRUD, see `add-roles-feature.md`), but a role has no permissions attached, so it does not control anything yet.
- The `authorize` app syncs department/user/document relationships into SpiceDB via CDC, but there is no permission model tied to roles.
- Goal: add a role-permission feature so each department role can be granted a set of permissions, and department users inherit the permissions of their assigned roles.

## Acceptance Criteria

- [x] Add menu `Permissions` for department
- [x] Add feature allow setup `Permissions`

## Solutions

- [x] Add permission page
- [x] Add menu permission for department
- [x] Add CRUD endpoints for permission
- [x] Add `RolePermission` table
- [x] `RolePermission` should include resource, role, create, update, delete, read.
- [x] When `RolePermission` changes -> update for spiceDb.
- [x] Base on `create`, `update`, `delete`, `read` -> create relationship for spiceDb
