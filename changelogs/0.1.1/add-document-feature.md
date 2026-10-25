# Add document feature

## Currently

- The `documents` module exists in API (`apps/api/src/modules/documents`) and web (`apps/web/src/modules/documents`) as structure only; no document logic is implemented.
- Documents already belong to a department, and the `authorize` app syncs document relationships (department, owner) into SpiceDB via CDC, so permissions can be granted per document (`document:<id>`) or for all (`document:all`).
- Goal: implement the document feature (API + web) so documents can be created, viewed, updated and deleted within a department, respecting role permissions.

## Acceptance Criteria

- [ ] Update `Documents` page with tree view
- [ ] The DocumentPage allow upload and manager files, folder

## Solutions

- [ ] Create `Folder` table with (name, parent_id: folder)
- [ ] Create `File` table with (name, path, parent_id: folder)
- [ ] Page `Documents` default show list of `folder` and `file` with parent_id is null
- [ ] Add module `document` for `apps/web`
- [ ] Module as a file browser
- [ ] Module component using `dnd-kit` show allow drag and drop
- [ ] Drag and drop support move only, sort alway base on name
