# Files

Web module `apps/web/src/modules/file`. There is no API module yet.

## `UserFilePicker`

Wrapper around the shared `FileBrowser` from `@tomato/ui/client`: lets a user upload and manage their files in a dialog, then pick some of them. It knows nothing about what the files are used for.

- `options` takes every `FileBrowserOptions` plus `title`, `confirmLabel` and `confirmFailedMessage`.
- The confirm button calls `onConfirm(files)` with the selected files and closes the dialog. If it rejects, a toast shows `confirmFailedMessage` and the dialog stays open.
- Uploads, folders, renames, moves and deletes only change local state. The list is lost when the component unmounts, until a storage API exists.

`UserProfilePanel` uses it to change the avatar, with `AVATAR_PICKER_OPTIONS` from the `user` module.
