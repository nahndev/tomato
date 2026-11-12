# Split FileBrowser into new module

## Currently

- `FileBrowser` lives in `@tomato/ui` as a single 654-line file, `packages/ui/src/components/file-browser.tsx`, next to the generic shadcn components.
- That one file holds the types, the tree and filter helpers (`getFolderPath`, `canMoveTo`, `matchesAccept`), `NameDialog`, and the whole browser UI.
- It is the only reason `@tomato/ui` depends on `react-dropzone`, and every other `@tomato/ui` consumer inherits that dependency.
- Its only direct consumer is `UserFilePicker` in the web `file` module, imported through `@tomato/ui/client`.

## Acceptance Criteria

- [x] Create new `apps/storage` is service for file browser
- [x] For backend service `storage`
  - [x] Add CRUD endpoints for files
  - [x] Add CRUD endpoints for folders (include files)
  - [x] Add CRUD endpoints for group (include folders, files)
  - [x] Add `nextjs` rewrite api `/rest/storage/:path*` -> storage service `/rest/:path*`
  - [x] Add `nextjs` rewrite api `/rest/copilotkit/:path*` -> copilot service `/copilotkit/:path*`, update for current api

- [x] For frontend, update `FileBrowser`
  - [x] Using CRUD endpoints for files
  - [x] Using CRUD endpoints for folders
- [x] For frontend, update `FileBrowser` accept `value` and `onChangeValue` for selector action, only emit when click submit button
- [x] For frontend, update `FileBrowser` options with
  - [x] `accept` - filter with type
  - [x] `multiple` - allow `value` and `onChangeValue` with multiple items

- [x] For `group` with records
  - `type` is enum `user`, `department`
  - `uuid` is uuid of type
  - `folder` is 1:1 for `group`

- [x] When user, department created -> emit `amqp` -> storage service listen `amqp` -> seed `group`
  - Done with the existing Debezium + Kafka CDC instead of `amqp`, as agreed: `users` and `departments` topics

## Solutions

- [x] Plan design database schema, ask me before apply
- [x] Create new service
