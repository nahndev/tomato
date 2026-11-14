# Adjust the uploader widgets to use `@tomato/storage-ui` instead of their own handler

## Currently

- Two uploader widgets exist in [template-widget](../../apps/web/src/modules/template-widget/components/items), registered in `widget-registry.ts` as `WidgetType.FILE_UPLOADER` and `WidgetType.IMAGE_UPLOADER`. Each one handles the selected file itself with a raw `<input type="file">`, and nothing is uploaded:
  - [file-uploader-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/file-uploader/file-uploader-widget-item.tsx) keeps only metadata (`UploadedFileMeta`: `name`, `size`, `type`) in the value ("Only file metadata is kept until an upload endpoint exists."). The file content is lost, so a submitted file can never be opened or downloaded.
  - [image-uploader-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/image-uploader/image-uploader-widget-item.tsx) reads the image with `FileReader` and stores it in the value as a base64 `dataUrl` (`UploadedImage`) ("Kept client-side as a data URL until an upload endpoint exists."). The full image is therefore written into the collab document and the submission values, which grow with every image.
- That upload endpoint now exists. The storage app (`apps/storage`, see [storage.md](../../docs/storage.md)) stores files in folders that belong to a group (`user` or `department`): `POST /files` (multipart `file` + `folderId`) and `GET /files/:id/content`, reached from web through `/rest/storage`.
- [`@tomato/storage-ui`](../../packages/storage) (`packages/storage`) already wraps that API and the UI:
  - `createStorageApi` provides `uploadFile` (with progress), `getFileContentUrl` and `listGroups(limit)`.
  - `useFileUploads` tracks upload progress and failures.
  - `FileBrowser` / `FileBrowserProvider` browse folders and upload into them; `Avatar` and `Picture` render a stored file.
- Other web features already go through it: the [file](../../apps/web/src/modules/file) module's `StorageProvider` and `UserFilePicker` (a `FileBrowser` dialog limited by a `StorageGroupLimit`, returning `StorageFile[]`), used by the user avatar (`user-profile-panel.tsx`) and the map (`map-extension.tsx`, `map-card.tsx` with `Picture`). The uploader widgets are the only file inputs that still bypass it.
- The board cannot show either widget (`widget-value-types.constants.ts`: `[WidgetType.IMAGE_UPLOADER]: NONE`, `[WidgetType.FILE_UPLOADER]: NONE`). Nothing on the API validates their values, so the stored metadata or data URLs are kept as is.

## Acceptance Criteria

- [ ] For `file-uploader` and `image-uploader`
- [ ] Using `packages/storage` for upload, saving uuid to `submission-value`
- [ ] Refactoring UI include `add` + `remove`
- [ ] `packages/storage` export new `FileItem` (suggest best name) show file on UI
- [ ] `packages/storage` export new `FileList` (suggest best name) show list files on UI with bulk api
- [ ] `apps/storages` support api get info `files` with cache for metadata and content

## Solutions

- [x] Storage api: `GET /files?ids=<id>,<id>` (`ListFilesQueryDto`: comma-separated or repeated uuids, up to `FILES_MAX_IDS` = 100) → `FilesService.list` → `FilesRepository.findByIds`; unknown ids are left out instead of `404`, so a deleted file does not fail the whole list
- [x] Cache: metadata (`GET /files`, `GET /files/:id`) sends `Cache-Control: private, no-cache` and is revalidated through the ETag Express adds (`304` when unchanged); content sends `private, max-age=31536000, immutable`, set in the handler on success only so a `404` is never cached (a file id's content never changes, only its name / folder)
- [x] `@tomato/storage-ui`: `api.listFiles(ids)` (split by `FILES_CHUNK_SIZE`), `useStorageFiles(ids)` (`storageKeys.files`, keeps previous data while new ids load)
- [x] Names: `StorageFileItem` / `StorageFileList` rather than `FileItem` / `FileList`, which clash with the DOM `File` / `FileList` types, and match `StorageFile`
- [x] `StorageFileItem`: one line `<icon> <name> … <actions>`: type icon, truncated name as download link, optional remove button
- [x] `StorageFileList`: one bulk request for `ids`, ordered like `ids`, a skeleton per loading id, an `unavailable` row (still removable) for unknown ids, retry on failure; labels in `DEFAULT_FILE_LIST_LABELS`
- [x] Widgets: `file-uploader` value is `string[]` of file ids, `image-uploader` one file id; add through `UserFilePicker` (`FILE_UPLOADER_PICKER_OPTIONS`: several files; `IMAGE_UPLOADER_PICKER_OPTIONS`: one `image/*`), where files are uploaded into a group; remove from `StorageFileList`; the button is disabled without `onChange`
- [x] Not covered: the picker has no `limit` (forms know neither the user nor the department, so every group is listed); legacy values (metadata, data URLs) are read as empty, not migrated; removing a file from a widget does not delete it from storage; the board still shows neither widget (`NONE`); the api does not validate the stored ids
