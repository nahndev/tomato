# Improve user-list component

## Currently

- `UserList` (`apps/web/src/modules/user/components/user-list.tsx`) is used on the department users page (`apps/web/src/app/system/departments/[slug]/user/page.tsx`) and, with `roleId`, inside `RoleDrawer` to list the holders of a role.
- Each `UserRow` shows only the name and email, with edit and delete icons. The avatar is not shown, even though `User` has `avatarFileId` and the `Avatar` component exists in `packages/storage`.
- A user can be edited in two places: the pencil icon opens `UserFormDialog`, and clicking the row opens `UserDrawer`. Role rows have already dropped these icons in favour of the drawer (`improve-department-role`).
- In the role drawer, the delete icon deletes the user entirely, not just their assignment to the role. There is no way to remove a holder from the role from this list.
- `useUsers` loads a single page (`USER_LIST_PAGE_SIZE = 100`) and search filters on the client, so users beyond that page cannot be found, and the total is not shown. `GET departments/:departmentId/users` accepts `page`, `pageSize` and `roleId`, but no search term.
- Search lowercases the query but not the email, so an email containing uppercase letters may not match.
- "New user" immediately creates a user with a placeholder name and a random `@example.com` email, then opens the drawer. Abandoning the drawer leaves that placeholder user behind.
- Some messages are hard-coded in the component ("Could not delete the user", "Could not load the users.") rather than coming from `UserErrorMessage`.

## Acceptance Criteria

- [x] Fist column is avatar with ring is color of role (update include of api, return color of role)
- [x] Second column is fullname
- [x] Third column is email
- [x] Four column is tel
- [x] Five is role name
- [x] Remove `edit` and `delete` icons

## Solutions

- [x] Return `roles` (`id`, `name`, `color`) on `User`, ordered by role name
- [x] Add shadcn `Table` to `@tomato/ui`, render `UserList` as a table
- [x] Ring uses the role of the role drawer, otherwise the first role; the role column lists all roles
- [x] Refresh the user list when a role is edited or deleted
- [x] Use `table-fixed` with truncated cells, hide tel and role in narrow containers
