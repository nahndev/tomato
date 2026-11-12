# Refactor image-map

## Currently

- Two earlier refactors ([refactor-image-map-with-provider.md](./refactor-image-map-with-provider.md), [image-map-frame.md](./image-map-frame.md)) added features to `@tomato/image-map` one after another. The package now has overlapping state and two ways of doing the same thing.
- The transform is held in three places that are kept in sync by hand:
  - the zustand store
  - `react-zoom-pan-pinch`, via `useZoomPanPinchSync`, which tracks active gestures, reverts library moves made outside a gesture, and uses an `isPushingRef` re-entry guard (this caused a stack overflow before)
  - the controlled `value.viewport.transform`, via `useTransformSync`
- The frame size is duplicated: `value.frame` is copied into the store's `contentSize` by an effect in `FrameLayer`, so layers read `contentSize` and fall back to `{ width: 1, height: 1 }` until it is set.
- Drags are handled two ways:
  - images use their own pointer-capture logic (`useImageDrag`, with its own threshold check)
  - pins use `@dnd-kit/react` (`DragDropProvider`, `PinDragOverlay`, an overlay measured to find the drop tip)
  - both hooks repeat the same "hold the drop until the prop catches up" state (`drop` / `isDropPending`)
- Layer behaviour depends on optional callbacks being passed or not: `ImageLayer` becomes interactive or movable only when `onSelect` / `onChange` is set, and `PinLayer` becomes draggable only when `onMove` is set. `ImageMap` turns these on and off with `isAddingPin`.
- `ImageMap` loops over `layers` twice (images first, then pins), so the order of the `layers` array is not the drawing order. Each layer also subscribes to `transform.scale` to counter-scale outlines, handles and pins (`1 / scale`).
- UI-only state (`selectedLayerId`, `isAddingPin`) sits in `ImageMapValue.viewport` next to the stored `transform`. `MapPage` splits this state back out on every change, and `fromImageMapLayers` rebuilds stored layers from image-map layers (dropping unknown images, renaming new pins).

## Acceptance Criteria

- [x] /home/dev/sources/tomato/packages/image-map/src/components -> remove prefix image-map
- [x] `image-map-provider` -> `StateProvider`
- [x] The package export `image-map` + `image-view`
- [ ] The `image-map` add props `header-append` and `header-prepend`.
  - `prepend` is `back-button` + `name`
  - `append` is `AddImage` button using `useImage` hooks (export by image-map)
- [x] Move `header` + `panel` -> `package/image-map`
- [x] Suggest new name for package

## Solutions

- [x] `components/image-map-provider.tsx` → `components/state-provider.tsx` (`StateProvider`): the zustand store plus a value context (`value`, actions from `useImageMapValue`); read with `useImageMap(selector)` / `useMapValue()`. `useTransformSync` takes the store as an argument
- [x] `selectedLayerId` / `isAddingPin` moved from `ImageMapValue.viewport` to the store (`selectLayer`, `setIsAddingPin`); the value holds only `frame`, `layers`, `viewport.transform`; `DEFAULT_VIEWPORT` removed
- [x] Public API reduced to `ImageMap`, `ImageView`, `ImageToolbar`, `useAddImage`, `ImageMapLayerType` and the types; `Viewport`, layers, store and other hooks are internal
- [x] `ImageMap` = `StateProvider` + `Header` (`leading`, `ImageToolbar`) + `ImageView` (viewport, layers, `ZoomControls`) + `Panel`; image `src` is a full URL (web: `getFileContentUrl(fileId)`, stored back as `fileId` through `getFileIdFromContentUrl` of `modules/file`)
- [x] `ImageToolbar`: "Delete image" (selected image) + "Add pin"; its `extension` prop is the expand slot, passed through from `ImageMap`'s `extension` (web: `MapExtension`, the "Add image" button in a `UserFilePicker`); `useAddImage()(src, alt?)` fetches the size, fits it in the frame, adds and selects it
- [x] `Header` and `Panel` + `PinForm` moved from web into the package; pins carry `description`; new pins are named `Pin n` in the package (`createLayerId` moved too); the form validates with `MAP_PIN_*_MAX_LENGTH` from `@tomato/constants` (new dependency)
- [x] Web `modules/map`: `map-header.tsx` removed; `MapPage` passes `leading` (back link + title), `extension` (`MapExtension`), maps layers and saves: added/removed/renamed layers are saved at once, other changes after `MAP_SAVE_DELAY` (`isLayerListChange`, tested in `map.utils.spec.ts`); `map-pin-panel.tsx`, `map-pin-form.tsx`, `mapPinSchema` removed
- [x] Package renamed `@tomato/image-map` → `@tomato/canvas` (`packages/canvas`): it is now a full editor (header, toolbar, view, panel) on a fixed frame, not only an image map, so the components take its name (below)
- [x] Names follow the package: `ImageMap` → `Canvas`, `ImageView` → `CanvasView`, `ImageToolbar` → `CanvasToolbar`, `ImageMap*` types/constants → `Canvas*` (`CanvasValue`, `CanvasLayer`, `CanvasLayerType`, …), `useImageMap*` → `useCanvas*`, files `image-map.*` → `canvas.*`; web `toImageMapLayers` / `fromImageMapLayers` → `toCanvasLayers` / `fromCanvasLayers`
