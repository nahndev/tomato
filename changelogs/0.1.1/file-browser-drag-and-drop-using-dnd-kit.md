# Use dnd-kit for FileBrowser drag and drop

## Currently

- `FileBrowser` moves files and folders with native HTML5 drag events, through `useFileBrowserDrag` in `packages/storage/src/hooks/use-file-browser-drag.ts`.
- Limits of the current approach:
  - It handles only mouse-style HTML5 drag events, so moving does not work on touch screens or from the keyboard.
  - The drag preview is the browser's default.
  - The hook has no auto-scroll or auto-expand, so moving an item to a folder that is out of view or collapsed takes extra steps.
  - Internal drags and OS file drags share the same DOM events, so the hook has to stop propagation by hand to keep the folder, root and `react-dropzone` targets apart.
- `@dnd-kit/react` is already used by `apps/web` and `packages/grid`, but not by `packages/storage`.
- Behavior to keep:
  - Dropping on a folder moves the item into it; dropping elsewhere in the tree moves it to the root, because the root row is hidden.
  - `canMoveTo` rules: no drop on the current parent, on the item itself or on a descendant.
  - Uploading by dropping OS files stays on `react-dropzone`.
- Goal: move internal drag and drop to dnd-kit, for consistency with the other packages and a better drag experience.

## Acceptance Criteria

- [ ] Using DndKit for drag and drop
- [ ] Install library
- [ ] Implement code

## Solutions

- [ ]
- [ ]
- [ ]
