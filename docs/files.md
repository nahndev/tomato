# Files

Package `@tomato/storage-ui` (`packages/storage`) and web module `apps/web/src/modules/file`, on top of the [storage service](storage.md).

## `FileBrowser`

Browses and manages the files of a group as an expandable tree: upload, create folders, rename, move by drag and drop, delete. Uploads and new folders go to the opened folder, or the root row when none is open.

Made of `GroupSidebar` and `ResourceContent` (`Toolbar` above a tree where each `Resource` is a `Folder` or a `File`, then `UploadList` and `SelectionBar`).

- Layout: uses container queries, so it adapts to its own width. Below `@xl` the sidebar becomes a row of groups above the content and the toolbar buttons show icons only.
- Previews: images show a thumbnail from `api.getFileContentUrl`, other files an icon by type. There is no thumbnail endpoint, so each one loads the original file, lazily.
- Feedback: `FileBrowserState` fills the tree when empty, without search matches or failed to load (with retry); `TreeSkeleton` while loading. `UploadList` shows the progress of each upload and keeps failed ones until dismissed. Other failed actions show a dismissible banner over the tree.
- Theme: only tokens and intents. The selected file uses `bg-selected`, the opened folder `bg-inset`.

- `api`: from `createStorageApi(axiosInstance)`. The web app builds it in `services/storage.service.ts`.
- `groups`: `{ type, uuid, label }[]`, chosen by the caller because the storage service has no per-user filtering and groups have no name. The sidebar always lists them; the first one opens by default. Switching group resets the opened folder, search and selection.
- `value`, `onChangeValue`: the selection. Clicks only change a draft; `onChangeValue` receives the selected `StorageFile[]` when the submit button is clicked. Without `onChangeValue` there is no selection and no submit button.
- `options`: labels, plus
  - `accept`: filters the listed files and the uploads by type
  - `multiple`: allows several selected files (default `true`); uploads always allow several
  - `maxSize` (default `STORAGE_FILE_MAX_SIZE`), `canCreateFolder`, `isReadOnly`, `defaultFolderId`

## `Avatar`, `Picture`

Render an image from a `src`, with a `fallback` when there is none. They do not fetch anything.

## `UserFilePicker`

`FileBrowser` in a dialog, in the web `file` module.

- `options` takes every `FileBrowserOptions` plus `title`, `confirmLabel` and `confirmFailedMessage`.
- `onConfirm(files)` receives the selected `StorageFile[]`, then the dialog closes. If it rejects, a toast shows `confirmFailedMessage` and the dialog stays open.

`UserProfilePanel` uses it to change the avatar, listing the groups of the user and of their department, with `AVATAR_PICKER_OPTIONS` from the `user` module: it downloads the chosen file with `downloadStorageFile` and sends it to the existing avatar endpoint.
