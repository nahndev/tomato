# Create shared FileUploader component

## Currently

- `@tomato/ui` has no file upload component, so each feature builds its own on top of a raw `<input type="file">`.
- `UserProfilePanel` hides an input behind the avatar button and handles type/size validation and loading state itself.
- `FileUploaderWidgetItem` (template editor) renders an unstyled native input and its own selected-file list.
- The new `Storage` tab in `UserDetailDrawer` has no content yet and will need file upload too.
- Add a shared `FileUploader` component to `@tomato/ui` so file selection, validation and the selected-file list look and behave the same everywhere.

## Acceptance Criteria

- [x] Create `FileBrowser` component support CRUD files, folder + drag and drop
- [x] Support react-dropzone allow upload with drag and drop
- [x] Create `UserFilePicker`, when click on trigger -> open `FileBrowser` as dialog with file filter
- [x] `FileBrowser` with `onItemsChange(changes)` (`upload-file`, `create-folder`, `rename`, `move`, `delete`) and `onSelect` allow custom handler instead using fix api

## Solutions

- [x] Add `FileBrowser` to `@tomato/ui/client`: controlled by a flat `items` list (`parentId`), read-only without `onItemsChange`; `accept`, `multiple`, `maxSize` and labels go through `options`
- [x] Use `react-dropzone` for file drops and native drag events to move items between folders and breadcrumbs
- [x] `accept` filters the list and uploads
- [x] Install `breadcrumb` with shadcn, restyle with theme tokens
- [x] Add web module `file` with `UserFilePicker`, a generic wrapper of `FileBrowser` (`options`, `onConfirm(files)`); the list stays in local state until a storage API exists
- [x] `UserProfilePanel` uses `UserFilePicker` for the avatar with `AVATAR_PICKER_OPTIONS`
- [x] Move `formatBytes` to `@tomato/utils` now that it has 2 consumers
