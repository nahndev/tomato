# Design and improve UI for FileBrowser

## Currently

- `FileBrowser` was moved to `@tomato/storage-ui` (`packages/storage`) and split into `GroupSidebar` and `ResourceContent` (`Toolbar`, tree of `Resource` rendering `Folder` or `File`), but the UI was carried over without a dedicated design pass.
- Its only consumer is `UserFilePicker`, a dialog capped at `sm:max-w-3xl`, used by `UserProfilePanel` to change the avatar.
- UI gaps:
  - Files: every file shows the same `FileIcon`, whatever its type, so choosing an avatar means choosing by file name. `Picture` exists in the same package but is not used here. Size is the only metadata shown.
  - Current location: uploads and new folders go to the opened folder, but the only hint is a `bg-muted` row. That is close to the `bg-accent` of a selected file.
  - Selection: the footer has only the submit button, with no selected count or summary. Selected files in collapsed folders are hidden from view.
  - States: loading is a small `Spinner` in the toolbar above an empty tree. An empty group and a search with no match can't be told apart (both use `labels.empty`, with no icon or action), and an opened empty folder shows no hint at all. Upload shows no per-file progress.
  - Errors: shown as a line of text above the tree, which pushes the tree down.
  - Theme: selected rows, the active group and drop targets use `bg-accent`, the solid accent color without its foreground, instead of a selected wash. `aria-current="true"` doesn't match `is-selected`, so the theme's selected state never applies.
  - Layout: `GroupSidebar` has a fixed `w-48` at every screen size, and its groups have no icon or visual type (user or department). Rows are dense and every row always shows its actions button.
- Goal: design the `FileBrowser` UI, then improve it so that finding, previewing and selecting files is clear in the picker dialog and on small screens.
- Mockups: none; the design was checked by rendering the real components in a throwaway harness (see Solutions).

## Acceptance Criteria

- [x] Improve UI with theme
  - [x] Only theme tokens and intents, no palette colors
  - [x] Follows light, dark and other themes with no per-theme code
- [x] Investigate UI and improve behavious, layout, color, format, ....
  - [x] Files show a thumbnail or a type icon, with size and date
  - [x] The opened folder is distinct from a selected file, and the toolbar shows where uploads go
  - [x] The footer summarizes the selection and can clear it
  - [x] Loading, empty group, empty folder, no search match and load failure each have their own state
  - [x] Each upload shows its progress; a failed one is named until dismissed
  - [x] Action errors no longer move the tree
  - [x] Works in the picker dialog and at phone width
- [x] Existing behavior and tests keep working

## Solutions

- [x] `bg-selected` + `data-selected` replace the misused `bg-accent`; `aria-current="true"` stays for assistive tech
- [x] `@container` queries instead of viewport breakpoints, as `FileBrowser` mostly lives in a dialog
- [x] `api.getFileContentUrl` (`client.getUri`, like `getUserAvatarUrl`) feeds `Picture`, which uses native lazy loading and now falls back on a load error
  - Risk: no thumbnail endpoint, so a thumbnail loads the original file (up to `STORAGE_FILE_MAX_SIZE`). Add one to the storage service if this gets slow
- [x] `useFileUploads` tracks each upload through `onUploadProgress`; per-file failures replace the generic banner
- [x] New components: `FileThumbnail`, `FileBrowserState`, `TreeSkeleton`, `UploadList`, `SelectionBar`
- [x] `Progress` and `Skeleton` added to `@tomato/ui` with shadcn, then moved to theme tokens
- [x] Row actions appear on hover or focus with a fine pointer, and stay visible on touch screens
- [x] Visual check of the states, at desktop and phone width, in light, dark and other themes, against a mock API
