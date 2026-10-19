# Template editor

Realtime visual editor for a template: sessions (wizard steps) holding widgets (form fields) placed on an 8-column grid. Ported from `tomato-form2/website/src/features/template`.

## How it works

- The draft of a template is a [Yjs](https://docs.yjs.dev/) document (`template/<templateId>`). The browser connects with `@hocuspocus/provider` to the **collab endpoint** (`ws://<collab>:3003`, `apps/collab`); several people can edit the same draft at once.
- `apps/collab` hosts the collab server (`@hocuspocus/server` `Server`, port `COLLAB_WS_PORT` default `3003`). It has no database; the api calls it to publish (see below) and it calls the api to sync submission values ([board-submission.md](board-submission.md)): `StorageService` (shared `StorageModule`, used by `CollabService` for `CollabGateway`) loads/stores the document state (Yjs update, debounced 1s, max 5s) as files `<COLLAB_DATA_DIR>/template/<templateId>` (the document name is the storage path) (default `apps/collab/data`, git-ignored; written atomically via temp file + rename). A missing file is an empty document.
- The web seeds the three system widgets (`created-at`, `template`, `submitted-by`) once the doc first syncs; their ids are fixed (`system-<type>`) so two clients seeding at once write the same keys.
- Publishing: `POST /api/templates/:templateId/versions` asks the collab HTTP endpoint (`GET /templates/:templateId/snapshot`, port `COLLAB_HTTP_PORT`) for the live document as a `TemplateSnapshot` and stores it as a new `template_versions` row.

### Doc schema

| Key               | Type          | Content                                         |
| ----------------- | ------------- | ----------------------------------------------- |
| `name`            | `Y.Text`      | template name                                   |
| `meta`            | `Y.Map`       | `ready` (seeded)                                |
| `widgets`         | `Y.Map`       | `widgetId → Widget`                             |
| `sessions`        | `Y.Map`       | `sessionId → Session`                           |
| `layouts`         | `Y.Map`       | `widgetId → GridLayout` (`column`, `span`, `idx`) |
| `widgetToSession` | `Y.Map`       | `widgetId → sessionId`                          |

Keys live in `TemplateDocKey` (`@tomato/constants`); types in `@tomato/types` (`template-editor.types.ts`).

## API (`/api/templates/:templateId/versions`)

| Method | Path                         | Response            |
| ------ | ---------------------------- | ------------------- |
| GET    | `/templates/:templateId/versions` | `TemplateVersion[]` (newest first) |
| POST   | `/templates/:templateId/versions` | `TemplateVersion` (`201`, snapshot of the live draft) |

- Unknown template → `404 NOT_FOUND`; collab unreachable → `502`; version collision → `409 CONFLICT`.
- Versions are `major.minor.patch`: the first publish is `1.0.0`, each next one bumps the minor (`1.1.0`, `1.2.0`, …).
- The api needs `COLLAB_URL` (the collab HTTP endpoint, e.g. `http://localhost:3005`).
- Module: `apps/api/src/modules/template-editor` (`TemplateEditorService` = list, `TemplateEditorRepository` = only DB access); websocket server: `apps/collab/src/modules/collab`; snapshot export: `apps/collab/src/modules/template` (`TemplateService` converts the live `Y.Doc` into a `TemplateSnapshot`, `TemplateController` exposes it).
- Table: `template_versions(id, template_id, version, snapshot jsonb, unique(template_id, version))`; cascades on template delete.

## Copilot

`apps/copilot` is a separate NestJS app (no DB, does not go through the api) that mounts a CopilotKit runtime (Gemini through the AI SDK) at `/copilotkit` on `COPILOT_PORT`, ahead of the body parsers. It needs `COPILOT_PORT`, `GEMINI_AI_KEY`, `GEMINI_MODEL` and `CORS_ORIGIN`, all required (it refuses to start without them). The web proxies `/copilotkit/*` straight to `COPILOT_URL` (`next.config.ts`).

The frontend registers tools only in edit mode: `addWidget`, `removeWidget`, `setWidgetProperties`, `setWidgetLayout`, `addSession`, `updateSession`, `removeSession`, plus context about the template, grid, widget types and the current selection.

## Web (`apps/web/src/modules/template-editor`)

- Route: `/templates/[id]` (`?mode=view` opens read-only; default is edit). The template list links here (`getTemplatePath`).
- Env: `NEXT_PUBLIC_COLLAB_URL` (default `ws://localhost:3003`), `COPILOT_URL` (default `http://localhost:3004`).

```text
template-editor/
├── components/   provider/ template/ session/ widget/ (+items/) property/ (+descriptors/) toolbar/ lexical/ canvas/ actions/
├── constants/    widget-items / widget-settings / widget-layouts
├── hooks/        state contexts (template, session, meta), react-query (template, versions), selection
├── sync/         events, handlers/, hooks/ (actions), copilot/
├── stores/       toolbar dock/popup mode (zustand, persisted)
└── services/     template + versions (axios)
```

- `shared/lib/sync` is the generic Yjs wrapper (`SyncDoc`, `@SyncHandler`, `@OnSyncEvent`, `useHandler`, `useTransaction`). A Handler owns one slice of the doc and reacts to other handlers' events instead of reaching into their data: `WidgetHandler` → `WidgetAddedEvent` → `LayoutHandler` places it. Handlers never open a transaction; `useTransaction()` does. Needs `experimentalDecorators` (set in `apps/web/tsconfig.json`).
- UI state is derived: `TemplateLiveStateProvider` re-reads the doc on every Yjs update into `useTemplateState()`.

### Adding a widget type

1. Add the key to `WidgetType` (`@tomato/constants`).
2. `components/widget/items/<type>-widget-item.tsx` (field component; never wire handlers that matter in the builder, it renders `inert`).
3. Defaults in `constants/widget-settings.constants.ts` and `constants/widget-layouts.constants.ts`; label/icon/group in `constants/widget-items.constants.ts`.
4. Register the component in `components/widget/widget-registry.ts` and the editable keys in `components/property/property-registry.ts`.

Every registry is a `Record<WidgetType, …>`, so a missing step fails to compile.

## Known gaps

- **Users / mail**: there is no users module, so the `users` widget is a disabled placeholder and a `user` mail recipient is a free-text id. Mail actions only warn until a context provides a runner (`ButtonActionProvider`).
- **Uploads**: `image-uploader` keeps a data URL and `file-uploader` keeps file metadata client-side; there is no upload endpoint yet.
- **api-call widget**: configured in the property panel, never executed.
- **Hosts**: the api-call host list is hard-coded (`API_CALL_HOSTS`).
- **Name**: the doc starts empty (the name is no longer seeded from the template), and renames are not synced back to `templates.name`.
- **Dashboard**: the reference's template list (`components/dashboard`) is covered by `template-browse`, so it was not ported.
