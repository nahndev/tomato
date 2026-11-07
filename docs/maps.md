# Maps

A map is a stack of layers of a department inside a fixed-size frame (1920×1080, `MAP_FRAME_SIZE` of the web module): images (floor plan, site plan, …) with pins placed above them. Images are files of the storage service. Layers store their position (and images their size) as ratios of the frame, so they stay in place whatever the frame is displayed at. The API does not check permissions yet, and maps are not synced to SpiceDB.

## Model

| Table  | Content                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------- |
| `maps` | `department_id` (FK, cascade on delete), `name` (1–100 chars), `value` (jsonb `MapValue`), `created_at`, `updated_at` |

`value` (`MapValue` of `@tomato/types`):

```jsonc
{
  "layers": [
    // Images drawn in order, pins above them.
    { "type": "image", "id": "image-…", "fileId": "<storage file uuid>", "x": 0.1, "y": 0, "width": 0.8, "height": 1 },
    { "type": "pin", "id": "pin-…", "label": "Entrance", "description": "", "x": 0.25, "y": 0.5 }
  ],
  "viewport": { "transform": { "x": 0, "y": 0, "scale": 1 } } // `null` = fitted
}
```

Layer ids are unique within a map (≤ 64 chars), up to 500 layers; pin `label` 1–100 chars, `description` ≤ 1 000 chars, `x`/`y` 0–1 from the top-left of the frame; image `width`/`height` > 0 and ≤ 4 (`MAP_IMAGE_RECT_MAX`), `x`/`y` from −4 to 1 (images may overflow the frame and are clipped to it). Migration `store_map_value` dropped `map_pins` and `image_file_id` and cleared existing maps.

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

- `@tomato/image-map` (`packages/image-map`):
  - `ImageMapProvider`: a `zustand` store per map (sizes, transform; zoom is limited to `MIN_ZOOM`–`MAX_ZOOM` of the fitted scale) with actions (`zoomBy`, `zoomTo`, `panBy`, `reset`, `getRatioPoint`, …). Read it with `useImageMap(selector)`; components inside the provider but outside the viewport (e.g. `ZoomControls`) can use it too.
  - `Viewport`: zooms (wheel, pinch, `ZoomControls`) its layers with `react-zoom-pan-pinch`, and pans only when dragging anywhere while holding Space (`PAN_KEY_CODE`, through `useSpacePan`; layers then ignore the pointer); otherwise drags belong to the layers; the store stays the source of truth. It fits the frame in the page until the user zooms, and keeps part of it visible.
  - Layers, drawn in frame coordinates: `FrameLayer` (sets the content size, draws the frame), `ImageLayer` (an image at its rect, clipped to the frame; selected with a click, moved by dragging it and resized from its corner handles, aspect ratio kept, through `useImageDrag`), `MapLayer` (`onPointClick` with 0–1 ratios), `PinLayer` (one pin per layer, keeping its screen size; select, and drag with `onMove` through `@dnd-kit/react`; `ImageMapProvider` supplies the `DragDropProvider` and the drag overlay).
  - `ImageMap`: preset composing the above, controlled by `value` (`{ frame: { width, height }, layers: [{ type: "image", id, src, alt?, x, y, width, height } | { type: "pin", id, label, x, y }], viewport: { transform, selectedLayerId, isAddingPin } }`, `transform: null` = fitted) and `onChangeValue`, its only callback. Images are drawn in order, pins above them. Zooming, selecting, adding a pin (`isAddingPin`, then a click, also over images: a `pin-…` layer with an empty label), dragging a pin and moving/resizing an image all come back as a new value, through `useImageMapValue` (usable to compose a custom map). `fetchImageSize` + `fitImageRect` give a new image's rect, fitted and centered in the frame.
  - Source layout: `components/` (layers in `components/layers/`), `hooks/` (`useViewportObserver`, `useZoomPanPinchSync`, `usePinDrag`, `useImageDrag`, `useImageMapValue`, `useTransformSync`), `utils/`; store, constants and types at the root.
- `modules/map`:
  - `/system/departments/{slug}/maps`: cards with the image (search, add, rename, delete). Linked from the department sidebar.
  - `/maps/{id}`: full-screen map. Add images from the department's storage files ("Add image", fitted in the frame), move and resize them, delete the selected one ("Delete image"), add pins ("Add pin", then click the map), drag pins to move them, and edit or delete the selected pin in the side panel. Zoom, image and pin moves are saved after 500 ms (`MAP_SAVE_DELAY`) and on leaving the page; added/deleted images, pin edits and deletes are saved right away. New pins are named "Pin n".
