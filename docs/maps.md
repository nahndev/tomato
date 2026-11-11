# Maps

A map is a stack of layers of a department inside a frame (`frame`, chosen from presets in the toolbar; 1920×1080 `MAP_FRAME_DEFAULT_SIZE` for maps saved without one): images (floor plan, site plan, …) with pins placed above them. Images are files of the storage service. Layers store their position (and images their size) as ratios of the frame, so they stay in place whatever the frame is displayed at. The API does not check permissions yet, and maps are not synced to SpiceDB.

## Model

| Table  | Content                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------- |
| `maps` | `department_id` (FK, cascade on delete), `name` (1–100 chars), `value` (jsonb `MapValue`), `created_at`, `updated_at` |

`value` (`MapValue`, declared in `maps.types.ts` (api) and `map.types.ts` (web)):

```jsonc
{
  "frame": { "width": 1920, "height": 1080 }, // optional
  "layers": [
    // Images drawn in order, pins above them.
    { "type": "image", "id": "image-…", "fileId": "<storage file uuid>", "x": 0.1, "y": 0, "width": 0.8, "height": 1 },
    { "type": "pin", "id": "pin-…", "label": "Entrance", "description": "", "x": 0.25, "y": 0.5, "isLocked": true }
  ],
  "viewport": { "transform": { "x": 0, "y": 0, "scale": 1 } } // `null` = fitted
}
```

`frame` sides are integers from 100 to 10 000 (`MAP_FRAME_MIN_SIZE`, `MAP_FRAME_MAX_SIZE`). Layer ids are unique within a map (≤ 64 chars), up to 500 layers; any layer may have `isLocked` (optional boolean); pin `label` 1–100 chars, `description` ≤ 1 000 chars, `x`/`y` 0–1 from the top-left of the frame; image `width`/`height` > 0 and ≤ 4 (`MAP_IMAGE_RECT_MAX`), `x`/`y` from −4 to 1 (images may overflow the frame and are clipped to it). Migration `store_map_value` dropped `map_pins` and `image_file_id` and cleared existing maps.

## API

| Method | Path                              | Notes                                                                                     |
| ------ | --------------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/departments/:departmentId/maps` | paginated `DepartmentMap[]`                                                               |
| POST   | `/departments/:departmentId/maps` | `{ name }`, with an empty value                                                           |
| GET    | `/maps/:id`                       | `DepartmentMap`                                                                           |
| PATCH  | `/maps/:id`                       | `{ name?, value? }`; `value` replaces the whole value. New image files must be PNG, JPEG or WebP (checked from their bytes), ≤ 20 MB |
| DELETE | `/maps/:id`                       | `204`                                                                                     |

Validation errors, or an image file that is not an image → `400 VALIDATION_FAILED`; image over the size limit → `413 VALIDATION_FAILED`; unknown department, map, or storage file → `404 NOT_FOUND`.

## Web

- `@tomato/canvas` (`packages/canvas`):
  - Public API: `Canvas`, `CanvasView`, `CanvasToolbar`, `ToolbarButton`, `useAddImage`, `CanvasLayerType` and the types. Everything else is internal.
  - `Canvas`: `StateProvider` + `Header` (`leading`, `CanvasToolbar` with `extension` as its extra actions) + `CanvasView` + the pin `Panel`, controlled by `value` (`{ frame: { width, height }, layers: [{ type: "image", id, src, alt?, x, y, width, height } | { type: "pin", id, label, description, x, y }], viewport: { transform } }`, `transform: null` = fitted) and `onChangeValue`, its only callback. Image `src` is the full URL of the image. Images are drawn in order, pins above them. Zooming, adding/deleting layers, moving/resizing an image, dragging a pin and editing a pin all come back as a new value.
  - `StateProvider` (internal): a `zustand` store per map (sizes, transform, `selectedLayerId`, `isAddingPin`; zoom is limited to `MIN_ZOOM`–`MAX_ZOOM` of the fitted scale) and a value context with the actions of `useCanvasValue`. Selection and pin placing are view state, not part of the value.
  - `CanvasToolbar` (in `components/toolbar/`): icon buttons with tooltips (`ToolbarButton`), in groups split by vertical dividers: `extension` (app actions, rendered inside the provider so they can call `useAddImage`; use `ToolbarButton` to match) | `LayerTool` while a layer is selected (duplicate, lock/unlock, delete with a confirmation) | `FrameMenu` (dropdown of `FRAME_PRESETS`, each item a preview of its aspect ratio, its name and size; changing the frame scales the layers uniformly to fit, centered) and "Add pin". Locked layers can be selected but not moved, resized or dragged; duplicates get a new id and are shifted by `DUPLICATE_OFFSET`.
  - `useAddImage()` → `(src, alt?) => Promise<void>` (reads the image size, fits and centers it in the frame, selects it). `CanvasView`, `CanvasToolbar` and `useAddImage` must be used inside the provider.
  - `CanvasView`: `Viewport` + layers + `ZoomControls`. `Viewport` zooms (wheel, pinch, controls) with `react-zoom-pan-pinch`, and pans only when dragging anywhere while holding Space (`PAN_KEY_CODE`); otherwise drags belong to the layers; the store stays the source of truth. It fits the frame in the page until the user zooms, and keeps part of it visible.
  - Layers, drawn in frame coordinates: `FrameLayer` (sets the content size, draws the frame), `ImageLayer` (clipped to the frame; select, move, resize from the corners with the aspect ratio kept, through `useImageDrag`), `MapLayer` (point clicks as 0–1 ratios: places a pin while adding one, else clears the selection), `PinLayer` (keeps its screen size; select, drag through `@dnd-kit/react`). New pins are named "Pin n".
  - Source layout: `components/` (layers in `components/layers/`), `hooks/`, `utils/`; store, constants and types at the root.
- `modules/map`:
  - `/system/departments/{slug}/maps`: cards with the image (search, add, rename, delete). Linked from the department sidebar.
  - `/maps/{id}`: full-screen map (`Canvas` with a back link and the map name as `leading`, and `MapExtension` (an "Add image" `ToolbarButton` in a `UserFilePicker` of the department files) as `extension`; image `src` is `getFileContentUrl(fileId)`, turned back into the stored `fileId` with `getFileIdFromContentUrl`). Add images from the department's storage files ("Add image", fitted in the frame), move and resize them, duplicate, lock or delete the selected layer, change the frame, add pins ("Add pin", then click the map), drag pins to move them, and edit or delete the selected pin in the side panel. Zoom, image and pin moves are saved after 500 ms (`MAP_SAVE_DELAY`) and on leaving the page; frame changes and added, deleted, locked or edited layers are saved right away (`shouldSaveNow`). New pins are named "Pin n".
