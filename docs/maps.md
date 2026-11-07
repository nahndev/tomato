# Maps

A map is an image (floor plan, site plan, …) of a department with pins placed on it. The image is a file of the storage service; pins store their position as ratios of the image size, so they stay in place whatever the image is displayed at. The API does not check permissions yet, and maps are not synced to SpiceDB.

## Model

| Table      | Content                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `maps`     | `department_id` (FK, cascade on delete), `name` (1–100 chars), `image_file_id` (storage file id, no FK, nullable)              |
| `map_pins` | `map_id` (FK, cascade on delete), `label` (1–100 chars), `description` (≤ 1 000 chars), `x`, `y` (0–1, from the top-left)      |

## API

| Method | Path                                | Notes                                                       |
| ------ | ----------------------------------- | ----------------------------------------------------------- |
| GET    | `/departments/:departmentId/maps`   | paginated `DepartmentMap[]`                                 |
| POST   | `/departments/:departmentId/maps`   | `{ name }`                                                  |
| GET    | `/maps/:id`                         | `DepartmentMapDetail` (map + `pins`)                        |
| PATCH  | `/maps/:id`                         | `{ name? }`                                                 |
| PUT    | `/maps/:id/image`                   | `{ fileId }`: PNG, JPEG or WebP (checked from its bytes), ≤ 20 MB |
| DELETE | `/maps/:id`                         | `204`, deletes its pins                                     |
| POST   | `/maps/:mapId/pins`                 | `{ label, description?, x, y }`                             |
| PATCH  | `/maps/:mapId/pins/:id`             | `{ label?, description?, x?, y? }`                          |
| DELETE | `/maps/:mapId/pins/:id`             | `204`                                                       |

Validation errors, or an image file that is not an image → `400 VALIDATION_FAILED`; image over the size limit → `413 VALIDATION_FAILED`; unknown department, map, pin, or storage file → `404 NOT_FOUND`.

## Web

- `@tomato/image-map` (`packages/image-map`):
  - `TransformWrapper`: viewport that pans (drag) and zooms (wheel, pinch, `+`/`-`/`0` and arrow keys) its content. It fits the content until the user moves it, and keeps part of it visible. `useTransform()` exposes zoom actions and `getContentPoint`. A drag does not trigger the content's click.
  - `ImageMap`: an image in a `TransformWrapper`, with pins that keep their screen size. Clicking a pin selects it; with `isAddingPin`, clicking the image calls `onAddPin`; with `onMovePin`, pins can be dragged.
- `modules/map`:
  - `/system/departments/{slug}/maps`: cards with the image (search, add, rename, delete). Linked from the department sidebar.
  - `/maps/{id}`: full-screen map. Choose or change the image from the department's storage files, add pins ("Add pin", then click the map), drag pins to move them, and edit or delete the selected pin in the side panel.
