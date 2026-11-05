# Implement user detail form

## Currently

- Clicking a user row opens `UserDetailDrawer`, which is read-only: it shows the name and email in the header, plus the created and updated dates.
- Editing a user only happens in `UserFormDialog`, opened from the pencil icon on the row, so viewing and editing are split across two overlays.
- Add a form to `UserDetailDrawer` so a user's details can be viewed and edited in one place.

## Acceptance Criteria

- [x] Header is tabs bar with `Information`, `Credential`
- [x] Information include left panel and right panel
- [x] Left panel: top is avatar image, below is fullname, below is id, footer is address
- [x] Right panel: first line is EID + Name + Family Name, below email + tel, below is `Address` group with addresses component, below is `....` with Role
- [x] EID is a normal string instead of the uuid of the database record
- [x] Form auto saves with debounce and shows the saving status

## Solutions

- [x] Add `eid`, `family_name`, `tel`, `avatar_key` to `users`; add `user_addresses` and `user_roles`
- [x] Upload avatars to local disk under `UPLOADS_DIR`, checking the file type from its bytes
- [x] Sync `user_roles` to SpiceDB as `role#member` with `UserRoleMapper`
- [x] Install `avatar` with shadcn, restyle with theme tokens, add `defaultWidth` to `Drawer`
- [x] Add `useAutoSave`: debounce, one save at a time, flush when the drawer closes
- [x] `Credential` tab is an empty placeholder until auth exists
