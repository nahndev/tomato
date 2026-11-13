# Implement the `Users` widget

## Currently

- `WidgetType.USERS` (`users`) already exists in [template-editor.constants.ts](../../packages/constants/src/template-editor.constants.ts) and is registered everywhere in [template-widget](../../apps/web/src/modules/template-widget): `widget-items.constants.ts` ("Users", "Select a user from the workspace", `isDataField: true`, group `system`), `widget-settings.constants.ts` (label "User field"), `widget-layouts.constants.ts` (span 2) and the editor `property-registry.ts` (`LABEL`, `REQUIRED` only).
- The widget is only a placeholder: [users-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/users-widget-item.tsx) renders a disabled `Select` with "No users available" and the comment "Placeholder until a users module exists"; it ignores `value` / `onChange`, so a form can never hold a user and a `required` users widget can never be filled.
- The users module now exists: API `GET /departments/:departmentId/users` (`UsersController`, paginated, optional `roleId` filter in `ListUsersQueryDto`, no search by name / email) and `GET /departments/:departmentId/users/:id`; web [user](../../apps/web/src/modules/user) module has `listUsers` / `getUser` and `useUsers(departmentId, roleId?)`, which loads one page of `USER_LIST_PAGE_SIZE` and is built for the user management screens (it also exposes create / edit / delete mutations).
- The widget is typed as a single string (`FieldComponentProps<string>`), but other features already treat its value as a **list of user ids**:
  - `REPEAT_LINK_WIDGET_TYPES` and `REFER_LINK_WIDGET_TYPES` ([template-widget.constants.ts](../../apps/web/src/modules/template-widget/template-widget.constants.ts)) let `repeat-view` and `refer-submission` link to a users widget ("One submission per user of this widget.").
  - `submission-behaviors.service.spec.ts` (API) and `template-form.test.tsx` (web) seed it as `people: [ADA, BOB]`; `REFER_USER_SHORT_ID_LENGTH` shortens those ids.
- There is no widget setting to narrow which users can be picked (e.g. by role, by department) or to allow single vs. multiple selection, and the board view has no way to show it (`widget-value-types.constants.ts`: `[WidgetType.USERS]: NONE`).
- Nothing on the API validates a users value: `applyValues` stores whatever the collab sends, so ids that are not users of the submission's department (or deleted users) are kept as is.

## Acceptance Criteria

- [ ] Implement for `user` widget
- [ ] The `widget` include `DepartmentDescriptor` required is false
- [ ] The widget get all `user` with `department` query
- [ ] The widget get all `user` when department is empty
- [ ] The widget alway show list `uuid` to values

## Solutions

- [x] Api: `GET /users` (`UsersDirectoryController`, `ListAllUsersQueryDto`: pagination + optional `departmentId`) → `UsersService.listAll`; `UsersRepository.findMany` takes a `UserListFilter` (`departmentId?`, `roleId?`), so no department lists every department; an unknown `departmentId` lists none instead of `404`, so a widget pointing at a deleted department still renders
- [x] Property: `departmentUuid?: string` on `WidgetProperties` (web / api / collab types), `PropertyKey.DEPARTMENT_UUID`, registered for `users` (`[LABEL, REQUIRED, DEPARTMENT_UUID]`); copilot describes it as not settable
- [x] Editor: `DepartmentDescriptor` picks from `useDepartments()` (now exported by `department`), with an `All departments` item (`ALL_DEPARTMENTS_VALUE`) that clears the property, so the department is optional
- [x] Web data: `listAllUsers(departmentId?)` loads every page of `GET /users` (`USER_LIST_PAGE_SIZE`); `useAllUsers(departmentId?)` keyed by `userKeys.directoryList`; `useUsers` mutations also invalidate `userKeys.directory`
- [x] UI: `UsersWidgetItem` lists the users of `widget.departmentUuid` (or every user), shows the selected ones as badges (name, or `User <short id>` when not loaded) with a remove button, and adds one through a searchable `VirtualSelect` that hides already selected users; disabled without `onChange`
- [x] Value: always a `string[]` of user ids (`toUserIds` also turns a legacy single id into a list), matching what `repeat-view` / `refer-submission` read; `REFER_USER_SHORT_ID_LENGTH` renamed `USER_SHORT_ID_LENGTH`
- [x] Not covered: the api still does not check that stored ids are users (of the department); the board still shows no `users` column (`NONE`); `refer-submission` steps still show a short id; every user is loaded client-side, page by page
