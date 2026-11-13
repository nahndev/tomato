# Template editor

Realtime visual editor for a template: sessions (wizard steps) holding widgets (form fields) placed on an 8-column grid. Ported from `tomato-form2/website/src/features/template`.

## How it works

- The draft of a template is a [Yjs](https://docs.yjs.dev/) document (`template/<templateId>`). The browser connects with `@hocuspocus/provider` to the **collab endpoint** (`ws://<collab>:3003`, `apps/collab`); several people can edit the same draft at once.
- `apps/collab` hosts the collab server (`@hocuspocus/server` `Server`, port `COLLAB_WS_PORT` default `3003`). It has no database; the api calls it to publish (see below) and it calls the api to sync submission values ([board-submission.md](board-submission.md)): `StorageService` (shared `StorageModule`, used by `CollabService` for `CollabGateway`) loads/stores the document state (Yjs update, debounced 1s, max 5s) as files `<COLLAB_DATA_DIR>/template/<templateId>` (the document name is the storage path) (default `apps/collab/data`, git-ignored; written atomically via temp file + rename). A missing file is an empty document.
- The web seeds the three system widgets (`created-at`, `template`, `submitted-by`) once the doc first syncs; their ids are fixed (`system-<type>`) so two clients seeding at once write the same keys.
- Publishing: `POST /rest/templates/:templateId/versions` asks the collab HTTP endpoint (`GET /templates/:templateId/snapshot`, port `COLLAB_HTTP_PORT`) for the live document as a `TemplateSnapshot` and stores it as a new `template_versions` row.

### Doc schema

| Key               | Type          | Content                                         |
| ----------------- | ------------- | ----------------------------------------------- |
| `name`            | `Y.Text`      | template name                                   |
| `meta`            | `Y.Map`       | `ready` (seeded)                                |
| `widgets`         | `Y.Map`       | `widgetId → Widget`                             |
| `sessions`        | `Y.Map`       | `sessionId → Session`                           |
| `layouts`         | `Y.Map`       | `widgetId → GridLayout` (`column`, `span`, `idx`) |
| `widgetToSession` | `Y.Map`       | `widgetId → sessionId`                          |

Keys live in `TemplateDocKey` (`@tomato/constants`); types are declared by each app: `shared/types/template.types.ts` (web), `modules/template/template.types.ts` (collab), `modules/template-editor/template-editor.types.ts` (api).

### Canvas (container widget)

A `canvas` widget is a titled block (title = its `label`) with its own grid of widgets inside it.

- Its content is a `Session` stored in the canvas widget itself (`widget.session`, with `nested: { type: "widget", uuid: <canvas widget id> }`), not in the `sessions` map, so `sessions` only holds sections. The widgets inside map to `widget.session.id` in `widgetToSession` like any widget, so layouts, moves and the snapshot need nothing new.
- `WidgetHandler.addWidget` gives a canvas its session; `removeWidget` on a canvas also removes the widgets inside it. `findContainerWidgetId` goes from a content session back to its canvas, and `getTopSessionId` to the canvas's own session (session conditions, copilot).
- Rendering: `CanvasWidgetItem` (`template-widget`) measures its content width and renders the host's grid for the nested session as its child: `SessionGrid` in the editor (`EditorCanvasWidgetItem`), `FormSessionGrid` in `TemplateForm` (`FormCanvasWidgetItem`). The inner grid keeps 8 columns with a smaller `columnWidth` (`@tomato/grid` option) and is `isNested`: only a drop under the pointer counts, and it wins over the outer session's grid. In the builder a canvas is not `inert`, so its widgets can be dragged, resized and selected.

## API (`/rest/templates/:templateId/versions`)

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

## Web

The web side is split into four modules; dependencies point one way:

```text
template-editor ──► template-widget ◄── template-form
       └─────────► template-data ◄────────────┘
```

The template records themselves (`Template`, `TemplateVersion`, `TemplateSnapshot`) are in `shared/types/template.types.ts`, and their API hooks (`useTemplate`, `useTemplates`, `useTemplateVersions`, `usePublishTemplate`) in the `template` module (see `templates.md`), so a module that only needs a template or a version (`board`, `submission`) never imports the editor.

- `template-editor`: the builder (realtime sync, copilot, toolbar, property panel, versions/publish). Exports only `TemplateEditor`, `resolveTemplateMode`. Owns the template structure helpers it alone uses (`utils/container-widget`: `isContainerWidget`, `canNestWidget`, `createContentSession`, `getContentSessions`, `findContainerWidgetId`, `getTopSessionId`).
  - `TOP_LEVEL_WIDGET_TYPES` (`refer-submission`) never go inside a container, because their behavior reads top-level values only: a nested grid does not accept them on drag (`ContainerLayout` `accept`), `WidgetHandler.addWidget` puts one added next to a nested widget after the outermost container instead, `useSessionActions` ignores a move into a container (`WidgetHandler.canPlace`) and the copilot's `setWidgetLayout` returns an error.
- `template-widget`: how a widget looks, used by both. Exports `WidgetView` (label + field component, controlled by `value` / `onChange`), `EditorIcon`, `TextEditor`, the widget definitions (`WidgetItems`, `WidgetItemList`, group labels/order, `DEFAULT_LAYOUT`), `sortOptions`. It must not import sync or builder state. A widget that reads submission dependencies (`refer-submission`) uses the `submission-dependency` hooks, which read nothing outside a submission.
  - A field component reads what lies outside its own `value` with the `template-data` hooks, not with extra props. Keep the logic in the widget: a host wraps a widget only to render its content (containers: `FormSessionGrid`), not to compute its props.
- `template-data`: the read-only template data the widgets share, and its hooks. It imports no other template module.
  - `TemplateDataProvider` takes `widgets`, `links` and, from a form only, `values`; the editor (`TemplateSnapshotProvider`) gives `widgets` / `links` only, so a component must render without the rest (the refer submission widget shows its placeholder in the editor).
  - `DataScopeProvider` / `useDataScope` / `toScopedKey`: the path a value is stored under inside a mixed or repeat view (`<viewId>.<tabId>.<widgetId>`).
  - Hooks: `useWidget`, `useWidgetLink`, `useWidgetValue` (another widget's value, from the enclosing data scope outwards: a widget in the same tab first, then outer ones), `useScopedValue` (the value under exactly one scoped key, read by `FormWidgetItem`).
  - Holds only data read by ≥ 2 modules. Writes stay in the host (`onChange` in `template-form`, Yjs in `template-editor`), as does host-only state (selection, mode, meta, sync, `TemplateFormState`). State is per instance through context, never a global store.
- `template-form`: `TemplateForm`, renders a `TemplateSnapshot` for filling in (sessions shown by their condition, `session-condition`); `TemplateFormState` (`TemplateFormProvider`) holds only `snapshot` and `onChange`, values are read from `template-data`. Used by `submission`.

- Route: `/templates/[id]` (`?mode=view` opens read-only; default is edit). The template list links here.
- Env: `NEXT_PUBLIC_COLLAB_URL` (default `ws://localhost:3003`), `COPILOT_URL` (default `http://localhost:3004`).

```text
template-editor/
├── components/   provider/ (doc, snapshot, meta, mode, widget selection) layout/ (header, workspace) session/ widget/ (editor widget items)
│                 toolbar/ (widget, structure, property (+fields/, fields/button-actions/), version, chat)
├── copilot/      components/ (provider, agent context, tools), utils/ (input schemas, describe-template)
├── hooks/        session state, top-level sessions, selection
├── sync/         events, handlers/, hooks/ (actions), create-template-sync-doc
├── stores/       toolbar dock/popup mode (zustand, persisted)
└── utils/        container-widget, read-template-snapshot, template-mode, …

template-widget/
├── components/   widget-view, widget-registry, items/, lexical/, canvas/, actions/ (button runner), editor-icon
├── hooks/        repeat tabs, refer apply
├── constants/    widget-items / widget-settings / widget-layouts
└── utils/        options, datetime, users, refer-submission

template-data/
├── components/   template-data-provider, data-scope-provider
├── hooks/        widget / link / value, scoped value, data scope
└── utils/        data-scope

template-form/
├── components/   template-form, template-form-provider, form-session-box, form-session-grid, widget/ (form widget items)
├── hooks/        refer pending
└── utils/        session-condition, refer-submission
```

- `shared/lib/sync` is the generic Yjs wrapper (`SyncDoc`, `@SyncHandler`, `@OnSyncEvent`, `useHandler`, `useTransaction`). A Handler owns one slice of the doc and reacts to other handlers' events instead of reaching into their data: `WidgetHandler` → `WidgetAddedEvent` → `LayoutHandler` places it. Handlers never open a transaction; `useTransaction()` does. Needs `experimentalDecorators` (set in `apps/web/tsconfig.json`).
- UI state is derived: `TemplateSnapshotProvider` re-reads the doc on every Yjs update into `useTemplateSnapshot()` (a `TemplateSnapshot`, the same shape a published version stores).

### Adding a widget type

1. Add the key to `WidgetType` (`@tomato/constants`).
2. `template-widget/components/items/<type>-widget-item.tsx` (field component; never wire handlers that matter in the builder, it renders `inert` unless the type is a container). Read other widgets with the `template-data` hooks instead of extra props.
3. Defaults in `template-widget/constants/widget-settings.constants.ts` and `widget-layouts.constants.ts`; label/icon/group in `widget-items.constants.ts`.
4. Register the component in `template-widget/components/widget-registry.ts` and the editable keys in `WIDGET_PROPERTY_KEYS` (`template-editor/template-editor.constants.ts`).

Every registry is a `Record<WidgetType, …>`, so a missing step fails to compile.

## Known gaps

- **Users / mail**: a `user` mail recipient is a free-text id. Mail actions only warn until a context provides a runner (`ButtonActionProvider`).
- **Uploads**: `image-uploader` keeps a data URL and `file-uploader` keeps file metadata client-side; there is no upload endpoint yet.
- **Name**: the doc starts empty (the name is no longer seeded from the template), and renames are not synced back to `templates.name`.
- **Dashboard**: the reference's template list (`components/dashboard`) is covered by `template`, so it was not ported.
