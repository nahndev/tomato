# Implement interactive map feature for project

## Currently

- The app has no `project` concept: there is no `Project` model in Prisma and no `project` module in `apps/api` or `apps/web`.
- No map library is installed in any app or package, and no existing screen displays geographic data.

## Acceptance Criteria

- [x] Create a new package `packages/image-map`
- [x] Package support component image render as map with zoom, pin, select, ...
- [x] Component `TransformWrapper` allow drag + zoom content
- [x] Department add menu `map` support multiple map, when click on map -> open `/maps/{id}`

## Solutions

- [x] Package `@tomato/image-map`: `TransformWrapper` (drag, wheel/pinch/keyboard zoom, `useTransform`), `TransformControls`, `ImageMap` (pins: add, select, drag to move), transform math in `transform.utils.ts`
- [x] Tables `maps` (department, name, image file) and `map_pins` (label, description, `x`/`y` as 0–1 ratios of the image)
- [x] API module `maps`: department maps list/create, `/maps/:id` get/rename/delete, `PUT /maps/:id/image` (checked as an image through the storage service), pins CRUD
- [x] Move `StorageFileClient` and image type detection from `users` to `common/storage` to share them with `maps`
- [x] Web module `map`: "Maps" in the department sidebar (`/system/departments/{slug}/maps`) and the full-screen `/maps/{id}` page
- [x] Docs: `docs/maps.md`
