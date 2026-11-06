# Files

Web module `apps/web/src/modules/file`, on top of the [storage service](storage.md).

## `FileBrowser`

Browses and manages the files of one group: upload, create folders, rename, move by drag and drop, delete.

- `group`: `{ type, uuid }`, the owner of the group.
- `value`, `onChangeValue`: the selection. Clicks only change a draft; `onChangeValue` receives the selected `StorageFile[]` when the submit button is clicked. Without `onChangeValue` there is no selection and no submit button.
- `options`: labels, plus
  - `accept`: filters the listed files and the uploads by type
  - `multiple`: allows several selected files (default `true`); uploads always allow several
  - `maxSize` (default `STORAGE_FILE_MAX_SIZE`), `canCreateFolder`, `isReadOnly`, `defaultFolderId`

## `UserFilePicker`

`FileBrowser` in a dialog.

- `options` takes every `FileBrowserOptions` plus `title`, `confirmLabel` and `confirmFailedMessage`.
- `onConfirm(files)` receives the selected `StorageFile[]`, then the dialog closes. If it rejects, a toast shows `confirmFailedMessage` and the dialog stays open.

`UserProfilePanel` uses it to change the avatar, with `AVATAR_PICKER_OPTIONS` from the `user` module: it downloads the chosen file with `downloadStorageFile` and sends it to the existing avatar endpoint.
