# Add image scaling for `apps/storage`

## Currently

- The storage service ([storage.md](../../docs/storage.md)) only serves a file as it was uploaded: `GET /files/:id/content` reads the whole object from `STORAGE_DIR` into memory (`FilesStorage.read` → `Buffer`) and returns it with its own `mimeType` (always `attachment`, `nosniff`, `Cache-Control: private, max-age=31536000, immutable`). There is no size, width or format parameter, and no derived version (thumbnail, preview) is stored.
- Uploads are kept unchanged up to `STORAGE_FILE_MAX_SIZE` (20 MB, [storage.constants.ts](../../packages/constants/src/storage.constants.ts)); avatars are limited to `AVATAR_MAX_SIZE` (5 MB) and map images to `MAP_IMAGE_MAX_SIZE` (= 20 MB). Neither `apps/storage` nor `apps/api` has an image library (no `sharp`); `FilesService.create` only checks the name and stores the bytes.
- Every place that shows an image loads the original through `getFileContentUrl`, whatever size it is drawn at:
  - `@tomato/storage-ui`: `FileThumbnail` (32 px in each `File` row of `FileBrowser`, and in `SelectionBar`), `PicturePreview` (≈256 px hover card of `StorageFileItem`) and `Avatar`. [files.md](../../docs/files.md) states it: "There is no thumbnail endpoint, so each one loads the original file, lazily."
  - web: the user list and profile panel (`Avatar`, one original per row), `map-card.tsx` (`Picture` of the map image in the list), and the map canvas (`map-extension.tsx` adds the original URL as the image layer, where the full resolution is actually needed).
- So a folder with many photos, a list of users with avatars, or the map list downloads and decodes several MB per image to draw a few dozen pixels; the browser cache (`immutable`) only helps after the first load.

## Acceptance Criteria

- [ ] Using `sharp` library
- [ ] When a image uploaded -> emit event
- [ ] Event handler load file -> generate scaling with multiple size
- [ ] Using image with these sizes instead of origin

## Solutions

- [x] Dependencies: `sharp` and `@tomato/events` in `apps/storage`; `EventsModule` imported by `AppModule`
- [x] Sizes: `ImageVariant` (`small`, `medium`) in `@tomato/constants`, shared by storage, `@tomato/storage-ui` and web; widths in `IMAGE_VARIANT_SIZES` (128 / 512 px, storage only); scalable types `SCALABLE_IMAGE_TYPES` = `ImageMimeType` (PNG, JPEG, WebP)
- [x] Event: `FilesService.create` emits `ImageUploadedEvent(objectId)` for a scalable image once its row exists
- [x] Handler: `ImageVariantsListener` → `ImageVariantsService.generate` reads the original and writes one WebP per variant (`fit: inside`, `withoutEnlargement`, EXIF `rotate`) through `FilesStorage.saveVariant` as `<objectId>.<variant>`; it never throws (errors are logged)
- [x] Serving: `GET /files/:id/content?variant` (`FileContentQueryDto`) returns the copy as `image/webp`, cached `immutable`; when the copy is missing it returns the original with `private, no-cache` and generates the copy in the background, so files uploaded before scaling catch up on first view
- [x] Cleanup: `FilesStorage.remove` deletes the copies with the original (file and folder deletes)
- [x] Clients: `getFileContentUrl(id, variant?)` in `@tomato/storage-ui` and web; `small` for `FileThumbnail` (`File`, `SelectionBar`) and `Avatar` by default, `medium` for `PicturePreview`, the profile panel `Avatar` and `map-card`; the map canvas keeps the original
- [x] Not covered: GIF, SVG and other types are served as uploaded; a copy generated while its file is being deleted can be left on disk; existing files are scaled lazily, not by a migration
