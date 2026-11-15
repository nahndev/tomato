# Board and submission

Ported from `tomato-form2` (`server/src/{board,submission}`, `website/src/features/{board,submission}`). A board links templates; a submission is based on a published **template version**.

## Model

| Table             | Content                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `boards`          | `name`, `table_columns` (jsonb: the table view's columns `{ id, type, size, label }[]`, default `[]`) |
| `board_template_table_settings` | the table view's setting of one linked template (key `board_id, template_id`; cascade from `board_templates`): `items` (jsonb `columnId → { widgetId, property }`) |
| `board_template_task_settings` | the task view's setting of one linked template (key `board_id, template_id`; cascade from `board_templates`): `type_widget`, `title_widget`, `status_widget`, `assignee_widget` (widget ids, nullable), `conditions` (jsonb `{ widget, operation, value }[]`) |
| `board_templates` | links a board to the **templates** whose submissions it shows (cascade on both sides)             |
| `submissions`     | `template_version_id` (restrict), `data`, `data_clocks`, `data_displays` (all jsonb), `title` (required, default `''`), `meta_clocks` (jsonb) |
| `submission_dependencies` | directed edge `source_id → target_id` (cascade on both), `type`, `refer`, `idempotency_key`, `meta` (jsonb) |

- A board links **templates**; a submission is based on a **template version** and has no board (migration `remove_submission_board_id`). A board shows the submissions of every version of its linked templates, so two boards linking the same template show the same submissions. Creating a submission picks a template and freezes its newest published version (`409` if it has none). The submission's template is reached through its version (`Submission.templateVersion.templateId`).
- Every board has all three views (`BoardView`: `table`, `task`, `agenda`; `@tomato/constants`); none can be added or removed. A view's per-template settings live in `board_template_<view>_settings`, so unlinking a template deletes them. A template without a task setting lists all its submissions in the task view. Migration `move_board_table_to_template_settings` split every board's table columns into `boards.table_columns` and one table setting per template, and dropped `board_tables` and `board_agendas`.
- A table column has a `label`, a `DisplayType` (`text`, `date`, `time`, `datetime`, `number`), a `size` (`{ width }` px or `{ flex }` fr) and, per linked template, an item `{ widgetId, property }` stored in that template's table setting (the widget, and which value property of it, to show for submissions of that template). The api takes and the web edits whole columns (`BoardColumn`, `items: templateId → item`); `getBoardColumns(board)` (web, module `board`) joins `tableColumns` with the templates' table settings. All widgets of a column share the display type. The widget picker reads the newest published version of each linked template; a submission on an older version shows an empty cell when that widget no longer exists.
- The task view is set per linked template: `type` and `status` are option widgets (`select`, `radio`, `checkbox`), `title` a `text` / `text-area` widget, `assignee` a `users` widget. A condition keeps a submission of that template when its option widget `is` / `is-not` (`TaskConditionOperation`, `@tomato/constants`) the option key `value` (matched against `data_displays[widget].default.entity`). Conditions of one template are ANDed and apply only to that template; a template without a setting has every submission listed. Unlinking a template deletes its settings.
- `property` is a `ValueType`: `default`, plus `date` / `time` for `datetime` widgets. Which widgets can fill a column, and as which display types, is `WIDGET_VALUE_TYPES` (web, `board-editor/constants`).
- A submission depends on another through a `submission_dependencies` edge (`source → target`). `type` is a `SubmissionDependencyType` (`parent`, `reference`; `@tomato/constants`) that later behaviors switch on; `refer` is an indexed free string for lookups (e.g. the widget that created the edge); `idempotency_key` is unique per source (NULLs never collide) so a repeated action does not add a second edge; `meta` holds extra data. Self-loops are rejected by a CHECK; deleting a submission (or its board) removes its edges.
- `data_displays` is derived from `data` and the version snapshot on every change: `widgetId → property → { entity?, date?, text? }` (`apps/api/.../submissions/display`), backfilled for every widget so the board renders cells without null checks.

## API

| Method | Path                      | Notes                                                                                |
| ------ | ------------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/boards`                 | paginated `BoardSummary` (name, `_count.templates`)                                  |
| GET    | `/boards/:id`             | `Board`: linked `templates` (`templateId`, `template` with `versions`: the newest published one, or empty) and its `tableSetting` / `taskSetting` (`null` until saved), and `tableColumns` |
| POST   | `/boards`                 | `{ name, templateIds? }`                                                             |
| PATCH  | `/boards/:id`             | partial `{ name, templateIds }`; unlinking a template deletes its table and task settings; templates that stay linked keep their link |
| PUT    | `/boards/:id/table-views` | `{ columns }` (`BoardColumn[]`): stores the columns on the board and replaces the table settings with their items per template; returns the `Board` |
| PUT    | `/boards/:id/task-views`  | `{ settings: [{ templateId, typeWidget?, titleWidget?, statusWidget?, assigneeWidget?, conditions }] }`: replaces the task settings (a linked template left out loses its setting); returns the `Board` |
| GET    | `/boards/:id/<view>-views/submissions` | paginated `Submission[]` of any version of the board's linked templates (empty when none is linked); for `task`, only those that pass the task view conditions |
| DELETE | `/boards/:id`             | keeps the submissions (they belong to templates, not boards)                         |
| GET    | `/submissions/:id`        | `SubmissionDetail` = submission + its `templateVersion`                              |
| GET    | `/submissions/:id/graph`  | `SubmissionGraph` of the submission's dependencies (see below)                      |
| POST   | `/submissions`            | `{ templateId }`; the template must exist (`400`) and be published (`409`)           |
| PUT    | `/submissions/:id/values` | `204`; called by collab (see below)                                                  |
| DELETE | `/submissions/:id`        | also deletes the submissions it refers to (one level)                                |

Each view has its own api module under `boards/`: `board-table` (`BoardTableModule`), `board-task` (`BoardTaskModule`; its filters carry the task conditions) and `board-agenda` (`BoardAgendaModule`); each imports `BoardsModule` and `SubmissionsModule`, and its `GET …/submissions` goes through `SubmissionsService.list` with one filter per linked template. Validation errors → `400 VALIDATION_FAILED` (a column that references an unlinked template, an unknown template id, a bad size, …); unknown ids → `404 NOT_FOUND`; a template without a published version → `409 CONFLICT`.

## Dependency graph

`GET /submissions/:id/graph` → `{ nodes, edges }` (api module `submission-dependencies`): the whole connected component of the submission, following edges in either direction with no depth limit (a recursive CTE whose `UNION` visits each submission once, so cycles end). `nodes` are `{ id, title }`, ordered by id, and include the submission itself; `edges` are every dependency between them (full rows). A submission without dependencies returns `{ nodes: [{ id, title }], edges: [] }`; an unknown id is `404`.

Edges are created by the `refer-submission` widget (see "Behaviors"): source = the submission being filled, target = the submission created for one user, `type: reference`, `refer` = `<sourceId>:<widgetId>`, `idempotency_key` = `<refer>:<userId>` (separator `SUBMISSION_REFER_SEPARATOR`). Deleting a target removes its edges (`target_id` cascade); deleting an edge never deletes its target by itself, the api deletes the target instead.

Web module `submission-dependency` owns the graph: its types, `useSubmissionGraph` (react-query, shared by every reader of the same submission) and `getSubmissionPath`. `DependencyGraphProvider sourceId` (mounted by `SubmissionForm`) loads the graph for the hooks inside: `useDependencySourceId`, `useDependenciesByRefer(refer)`, and `useDependency(idempotencyKey)` / `useHasDependency(idempotencyKey)`. `useSubmissionGraph` keeps the graph live over the realtime stream (see "Realtime events"): it joins the `submission:<id>` room of every node, patches a node's title on `submission.summary` and refetches the graph of every node on `submission.graph-changed`. Outside the provider (the template editor) they read nothing. The keys are built with `toSubmissionRefer` / `toSubmissionIdempotencyKey` (`@tomato/utils`), the same helpers the api uses, so no reader re-parses edges into its own shape.

On the web, `/submissions/[id]` shows it in a left sidebar (`SubmissionGraph`, module `submission`, mounted by `app/submissions/layout.tsx` so it survives navigation between submissions): `Graph.toTree()` reads each edge `source → target` as parent → child: it roots the tree at submissions that are no edge's target, nests under each submission its targets, and renders a submission reached a second time (several dependencies or a cycle) as a non-expanded refer row.

## Realtime values

- A submission is filled in through a Yjs document `submission/<submissionId>` on the collab websocket (same server and file storage as the template drafts). Its `values` map is `widgetId → value` (`SubmissionDocKey`).
- Its `meta` map holds `SubmissionDocMetaKey`s: `title` (edited in the submission header) and `updated` (`Date.now()`, written by the web with every value or title change; kept in the document only).
- When collab stores a submission document (debounced 1s, max 5s) it `PUT`s `{ values, meta }`, every key with the Yjs item clock that set it, to `${API_URL}/submissions/:id/values`. The api rewrites a key only when its clock changed, ignores keys that are not widgets of the version (values) or other than `title` (meta), rebuilds `data_displays`, and `applyMeta` stores a string `title` in its column (clock in `meta_clocks`). A failed push is logged and retried by the next store.

## Realtime events

- `GET /realtime?rooms=<room>,<room>` (api module `realtime`, NestJS `@Sse`) streams server-sent events for the given rooms. A room is `<RealtimeRoom>:<uuid>` (`toRealtimeRoom`, `@tomato/utils`): `template:<templateId>` or `submission:<submissionId>`; any other room → `400 VALIDATION_FAILED`. A `ping` event every `REALTIME_HEARTBEAT_MS` (15s) keeps idle streams open behind the Next.js rewrite.
- Domain events (`@tomato/events`: `EventBusService.emit(new …Event())`, `@OnDomainEvent(…Event)`): after `PUT /submissions/:id/values` stores a change, `SubmissionsService` emits `SubmissionUpdatedEvent` with the stored row; `DELETE /submissions/:id` emits `SubmissionRemovedEvent`; `SubmissionDependenciesService` emits `SubmissionDependenciesChangedEvent` (source id) when `deleteReferencedExcept` / `createReferDependencies` actually deleted or created something. `SubmissionsRealtimeListener` and `SubmissionDependenciesRealtimeListener` turn them into `RealtimeEvent`s (`@tomato/constants`):
  - `submission.values` → `template:<templateId>` (the template of its version): `{ id, templateVersion: { templateId }, data, dataDisplays, title, updatedAt }`; a board's submission table joins the room of each linked template and merges it into its row.
  - `submission.summary` → `submission:<id>`: `{ id, title, updatedAt }`; the dependency graph patches the node's title.
  - `submission.graph-changed` → `submission:<id>`: `{ id }`, when its edges changed (as source) or it was deleted; the graph of every node is refetched.
- Web: `shared/lib/realtime` keeps one `EventSource` on `/rest/core/realtime` for the union of the rooms joined by `useRealtimeRooms(rooms)` (ref-counted), reopens it when that set changes (the old stream closes once the new one is open), and hands each event to `useRealtimeEvent(event, listener)`.

## Behaviors

- A template snapshot carries `behaviors: { [widgetId]: WidgetBehaviorType[] }`, written by the editor when a widget of a type with behaviors is added (and dropped when it is removed).
- On `PUT /submissions/:id/values`, the pushed values are merged into an `ApplyChangesContext`, then `SubmissionBehaviorsService.applyBehaviors` runs the behaviors of every widget whose clock changed and whose merged value is truthy, and finally the values and `data_displays` are stored.
- `refer-submission`: syncs its edges with the ids of its linked `users` widget (`linkWidgetUuid`; a value that is not an array → `400 VALIDATION_FAILED`). It deletes the target submissions of deselected ids, then creates one empty submission of the newest published version of its linked template (`linkTemplateUuid`) per new id, together with its edge. A missing or unpublished template is logged and skipped so the push still saves its values.

## Web

- `modules/board`: `/system/boards` (list, create, delete), the sidebar **Boards** group (`BoardMenu`, one item per board, own query key `boardKeys.menu()`) and `/system/boards/[id]/submissions` (`BoardSubmissionPage`: new / delete submission, and a view mode read from `?view=` among `table`, `task` and `agenda` — `table` by default: `table` (`BoardTableView`, driven by `getBoardColumns(board)`), `task` (`BoardTaskView`: one `TaskItem` per submission from `GET /boards/:id/task-views/submissions`, `type - title - status - assignee`; the title falls back to the submission title, then the template name; refetched on every `submission.values` of a linked template since a change can move a task in or out of the conditions) and `agenda` (`BoardAgendaView`, a placeholder).
- `modules/board-editor`: board settings under `/system/boards/[id]/settings` (`BoardSettingsLayout`, side menu `BOARD_SETTING_SECTIONS`; `/system/boards/[id]` redirects to the first one): `templates` (`BoardTemplateSettingPage`, link / unlink templates; the api prunes the column items of unlinked templates), `table` (`BoardTableViewSettingPage`, edit columns), `task` (`BoardTaskViewSettingPage`, one card per linked template with its four widgets and its conditions) and `agenda` (`BoardAgendaViewSettingPage`, no settings yet). Each page is a `ViewSettingSection` (title, description, actions); views cannot be added or removed.
- `modules/submission`: `/submissions/[id]` fills the submission in realtime. It renders the version snapshot with `TemplateForm` (from `template-form`: sessions shown by their condition, controlled widgets, a canvas's widgets inside the canvas) over the submission document.
- A `refer-submission` widget builds its own keys: `refer = toSubmissionRefer(submissionId, widgetId)` and one `idempotencyKey` per user of its linked `users` value. It shows, before it runs, one step per key from `useDependenciesByRefer(refer)`: **created** (selected, edge exists), **will create** (selected, no edge) and **will delete** (edge of the refer whose key is no longer selected). `Apply` is enabled only when there is a change and writes the click time as the widget value. Until the graph shows no change, for at most `REFER_SUBMISSION_APPLY_TIMEOUT_MS` (30s) after the click, the pending steps spin; the graph refreshes itself when the api reports the new edges. After that they fall back to their pre-status, so a skipped run (template unpublished) can be applied again. The widget is top-level only: the editor keeps it out of canvases, mixed and repeat views, since the behavior reads `values[widgetId]`.

## Known gaps

- The agenda view (and its settings) is a placeholder; no charts, discussion or history tabs on the board.
- A task condition on a widget that a submission's version lacks never matches, even with `is-not`.
- No mail action, `users` / `submitted-by` values or search indexing; those widgets cannot fill a column. Button mail actions still only warn.
- No endpoint to create or delete dependencies: edges are only created and deleted by the `refer-submission` widget, or deleted with their submissions.
- No generic "update submission data" endpoint: values only arrive through collab.
- Lists load a single page (up to 100 boards / submissions).
