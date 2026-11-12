# Improve department role

## Currently

- The department roles page (`apps/web/src/app/system/departments/[slug]/roles/page.tsx`) renders `RoleList`, a flat list where each `RoleRow` shows only the role name with edit and delete actions.
- A `Role` has only `name` (unique per department), and the `Role` type exposes no user count or permission summary, so the page does not show who holds a role or what it grants.
- Roles are assigned to users one user at a time in `user-detail-form.tsx`, and permissions are set per resource on the permissions page. There is no view of this from the role itself.
- Deleting a role cascades to its `user_roles` and `role_permissions` rows, but the confirm dialog only says "This action cannot be undone", with no mention of the impact.
- `useRoles` loads a single page of roles (`ROLE_LIST_PAGE_SIZE = 100`) and search filters on the client, so roles beyond that page cannot be found. The same hook feeds the permissions page and the user detail form.

## Acceptance Criteria

- For apps/web
- [x] Add new module role include `RoleList` and `RoleDrawer`
- [x] Add roles item include name, description, color, status
  - name is text
  - description is below name, using as subtitle
  - color is hex, show square
  - status is badge
  - remove edit icon, delete icon
- [x] When click on item, open drawer with
  - color: Add component `ColorPicker` in `packages/ui`, `ColorProvider` in `package/ui`
  - status: is active or inactive
  - name: text editor
  - description: text editor
  - list: list of user with this role, using same `UserList`
- [x] Add web module for user with `UserList` and `UserDrawer` (split current code)

## Solutions

- [x] Add `description`, `color`, `status` to `Role` (migration `add_role_details`, `RoleStatus` in `@tomato/constants`)
- [x] Add `roleId` filter to `GET departments/:departmentId/users`
- [x] Move `useAutoSave` to `shared/hooks`, add `AutoSaveIndicator` to `shared/components`
- [x] Add `ColorPicker` and `ColorProvider` (preset colors) to `@tomato/ui/client`
- [x] Rename `UserDetailDrawer` to `UserDrawer`, `UserList` accepts `roleId`
- [x] Add `RoleDrawer` with auto-save, move delete role into the drawer
