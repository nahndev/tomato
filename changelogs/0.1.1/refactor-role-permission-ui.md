# Refactor RolePermission UI

## Currently

- The permissions page (`apps/web/src/modules/permissions`) renders one `RolePermissionCard` per role, each holding a full `Resource × Action` table (`PermissionList` → `RolePermissionCard`).
- With many roles the page becomes a long stack of repeated tables, hard to scan and to compare permissions across roles.
- Every checkbox toggle is saved immediately and all checkboxes are disabled while saving (`isSaving`), so the UI feels blocked.
- Loading, error and empty states are inlined in `PermissionList`.
- Goal: refactor the RolePermission UI to be clearer and easier to manage, without changing the API or the SpiceDB sync.

## Acceptance Criteria

- [x] Adjust `apps/web/src/app/department/[slug]/permissions/page.tsx`
- [x] The page show sidebar as tree of `item`
  - documents (document:all)
    - document 1 (document:1)
    - document 2 (document:2)
  - users (user:all)
    - user 1 (user:1)
    - user 2 (user:2)

- [x] When click on `item` -> show `content` as list role
- [x] Every `role` include permission `create`, `update`, `delete`, `read`

## Solutions

- [x] The `RolePermission` remove `department_id` record
- [x] Create component `PermissionSidebar`
- [x] Create component `PermissionSetup`
- [x] Create component `RolePermissionSetup` accept `role`
- [x] The `RolePermissionSetup` show list of <checkbox> <description>
- [x] When `RolePermission` change -> update spiceDb
