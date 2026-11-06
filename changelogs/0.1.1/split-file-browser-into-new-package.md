# Split FileBrowser into new package

## Currently

- `FileBrowser` lives in the web `file` module (moved out of `@tomato/ui` by `split-file-browser-into-new-module`), so only `apps/web` can use it.
- Its code is spread across `components/file-browser/`, `hooks/use-file-browser-drag.ts`, `hooks/use-storage-group.ts`, `utils/file-browser.utils.ts`, `file.types.ts` and `file.constants.ts`, mixed with module-level code such as `UserFilePicker`.
- It is tied to the web app through the data layer: `useStorageGroup` uses `services/storage.service.ts`, which uses `storageClient` from `@/shared/lib/api-client`. A package **must not** import `apps`, so this has to be decoupled.
- Its only direct consumer is `UserFilePicker`, and `CONTRIBUTING.md` allows a new package only with ≥ 2 consumers. The package also holds `Avatar` and `Picture`, used by the `user` and `template-browse` modules, but `apps/web` is still its only consuming app.
- Goal: move `FileBrowser` into its own package, reusable outside the web `file` module, and split it into smaller components.

## Acceptance Criteria

- [x] Move `FileBrowser` into new packages `packages/storage`
  - Published as `@tomato/storage-ui`: `@tomato/storage` is already the name of `apps/storage`
- [x] The `packages/storage` includes
  - [x] `Avatar` render avatar
  - [x] `Picture` render picture
  - [ ] ....
- [x] Split `FileBrowser` into
  - [x] `GroupSidebar` - left sidebar, show `groups` as list
  - [x] `ResourceContent` - right content, show tree of files and folder
    - [x] Top is `Toolbar`
    - [x] Content is `tree`
    - [x] Every item is `Resource` render `Folder` or `File`
    - [x] Refactor `FileBrowser` component

## Solutions

- [x] `createStorageApi(axiosInstance)` builds the API object; the web app passes it as the `api` prop, so `packages` never imports `apps`
- [x] `GroupSidebar` lists the `groups` passed by the caller, as groups have no name and the storage service has no per-user filtering; hidden with a single group
- [x] Expandable tree replaces the breadcrumb; a root row is the drop target and upload target for the root
