# Files

Package `@tomato/storage-ui` (`packages/storage`) and web module `apps/web/src/modules/file`, on top of the [storage service](storage.md).

## `FileBrowser`

Browses and manages the files of a group as an expandable tree: upload, create folders, rename, move by drag and drop, delete. Uploads and new folders go to the opened folder, or the root when none is open. Moving uses `@dnd-kit/react`: drag a row with the mouse, or use its handle by touch (long press) or keyboard (Space to pick up and drop, arrows to move, Escape to cancel). Dropping outside any folder moves the item to the root.

Made of `GroupSidebar` and `ResourceContent` (`Toolbar` above a tree where each `Resource` is a `Folder` or a `File`, then `UploadList` and `SelectionBar`).

- Layout: uses container queries, so it adapts to its own width. Below `@xl` the sidebar becomes a row of groups above the content and the toolbar buttons show icons only.
- Previews: images show a thumbnail from `api.getFileContentUrl`, other files an icon by type. There is no thumbnail endpoint, so each one loads the original file, lazily.
- Feedback: `FileBrowserState` fills the tree when empty, without search matches or failed to load (with retry); `TreeSkeleton` while loading. `UploadList` shows the progress of each upload and keeps failed ones until dismissed. Other failed actions show a dismissible banner over the tree.
- Theme: only tokens and intents. The selected file uses `bg-selected`, the opened folder `bg-inset`.

- `FileBrowserProvider`: must wrap `FileBrowser`. Takes `apiClient` (an axios instance) and `path` (the base URL of the storage service) and builds the API with `createStorageApi`. The web app mounts it once in the root layout through `StorageProvider` (web `file` module), with `apiClient` and the storage rewrite.
- `limit`: `StorageGroupLimit`, the filter on which groups to list, e.g. `{ OR: [{ type: "user" }, { type: "department", uuid }] }` or `{ type: { in: ["user", "department"] } }`. Empty or `null` lists every group, because the storage service has no per-user filtering. `FileBrowser` loads every page of `GET /groups`; the sidebar always lists them by `label` and the first one opens by default. Clicking a group passes its root `folder` to `ResourceContent`, which loads the tree. Switching group resets the opened folder, search and selection.
- `value`, `onChangeValue`: the selection. Clicks only change a draft; `onChangeValue` receives the selected `StorageFile[]` when the submit button is clicked. Without `onChangeValue` there is no selection and no submit button.
- `options`: labels, plus
  - `accept`: filters the listed files and the uploads by type
  - `multiple`: allows several selected files (default `true`); uploads always allow several
  - `maxSize` (default `STORAGE_FILE_MAX_SIZE`)

## `Avatar`, `Picture`

`Avatar` takes `uuid`, the id of a storage file, and loads it from the storage service, so it must be inside `FileBrowserProvider`. `Picture` takes a `src`. `uuid` is required: a user without an avatar renders the `Avatar` of `@tomato/ui` instead. Both show `fallback` when the image cannot be shown.

## `UserFilePicker`

`FileBrowser` in a dialog, in the web `file` module.

- `options` takes every `FileBrowserOptions` plus `title`, `confirmLabel` and `confirmFailedMessage`.
- `onConfirm(files)` receives the selected `StorageFile[]`, then the dialog closes. If it rejects, a toast shows `confirmFailedMessage` and the dialog stays open.

`UserProfilePanel` uses it to change the avatar, with `limit` set to the user and their department, and `AVATAR_PICKER_OPTIONS` from the `user` module: it sends the id of the chosen file to the avatar endpoint.
