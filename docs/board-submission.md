# Board and submission

Ported from `tomato-form2` (`server/src/{board,submission}`, `website/src/features/{board,submission}`). A board links templates; a submission is based on a published **template version**.

## Model

| Table             | Content                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `boards`          | `name`, `columns` (jsonb `BoardColumn[]`)                                                         |
| `board_templates` | links a board to the **templates** it collects submissions for (cascade on both sides)            |
| `submissions`     | `board_id`, `template_version_id` (restrict), `data`, `data_clocks`, `data_displays` (all jsonb), `title` (required, default `''`), `meta_clocks` (jsonb) |
| `submission_dependencies` | directed edge `source_id → target_id` (cascade on both), `type`, `refer`, `idempotency_key`, `meta` (jsonb) |

- A board links **templates**; a submission is based on a **template version**. Creating a submission picks a linked template and freezes its newest published version (`409` if it has none). The submission's template is reached through its version (`Submission.templateVersion.templateId`).
- A board column has a `label`, a `DisplayType` (`text`, `date`, `time`, `datetime`, `number`), a `size` (`{ width }` px or `{ flex }` fr) and `items`: `templateId → { widgetId, property }` (the widget, and which value property of it, to show for submissions of that template). All widgets of a column share the display type. The widget picker reads the newest published version of each linked template; a submission on an older version shows an empty cell when that widget no longer exists.
- `property` is a `ValueType`: `default`, plus `date` / `time` for `datetime` widgets. Which widgets can fill a column, and as which display types, is `WIDGET_VALUE_TYPES` (web, `board/constants`).
- A submission depends on another through a `submission_dependencies` edge (`source → target`). `type` is a `SubmissionDependencyType` (`parent`, `reference`; `@tomato/constants`) that later behaviors switch on; `refer` is an indexed free string for lookups (e.g. the widget that created the edge); `idempotency_key` is unique per source (NULLs never collide) so a repeated action does not add a second edge; `meta` holds extra data. Self-loops are rejected by a CHECK; deleting a submission (or its board) removes its edges.
- `data_displays` is derived from `data` and the version snapshot on every change: `widgetId → property → { entity?, date?, text? }` (`apps/api/.../submissions/display`), backfilled for every widget so the board renders cells without null checks.

## API

| Method | Path                      | Notes                                                                                |
| ------ | ------------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/boards`                 | paginated `BoardSummary` (name, `_count.templates`)                                  |
| GET    | `/boards/:id`             | `Board`: columns + linked `templates` (`templateId`, `template` with `versions`: the newest published one, or empty) |
| POST   | `/boards`                 | `{ name, templateIds?, columns? }`                                                   |
| PATCH  | `/boards/:id`             | partial; unlinking a template prunes its column items                                |
| DELETE | `/boards/:id`             | cascades to the submissions                                                          |
| GET    | `/submissions?boardId=`   | paginated `Submission[]` of a board                                                  |
| GET    | `/submissions/:id`        | `SubmissionDetail` = submission + its `templateVersion`                              |
| GET    | `/submissions/:id/graph`  | `SubmissionGraph` of the submission's dependencies (see below)                      |
| POST   | `/submissions`            | `{ boardId, templateId }`; the template must be linked to the board and published    |
| PUT    | `/submissions/:id/values` | `204`; called by collab (see below)                                                  |
| DELETE | `/submissions/:id`        | also deletes the submissions it refers to (one level)                                |

Validation errors → `400 VALIDATION_FAILED` (a column that references an unlinked template, an unknown template id, a bad size, …); unknown ids → `404 NOT_FOUND`; a template without a published version → `409 CONFLICT`.

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

- `GET /realtime?rooms=<room>,<room>` (api module `realtime`, NestJS `@Sse`) streams server-sent events for the given rooms. A room is `<RealtimeRoom>:<uuid>` (`toRealtimeRoom`, `@tomato/utils`): `board:<boardId>` or `submission:<submissionId>`; any other room → `400 VALIDATION_FAILED`. A `ping` event every `REALTIME_HEARTBEAT_MS` (15s) keeps idle streams open behind the Next.js rewrite.
- Domain events (`@tomato/events`: `EventBusService.emit(new …Event())`, `@OnDomainEvent(…Event)`): after `PUT /submissions/:id/values` stores a change, `SubmissionsService` emits `SubmissionUpdatedEvent` with the stored row; `DELETE /submissions/:id` emits `SubmissionRemovedEvent`; `SubmissionDependenciesService` emits `SubmissionDependenciesChangedEvent` (source id) when `deleteReferencedExcept` / `createReferDependencies` actually deleted or created something. `SubmissionsRealtimeListener` and `SubmissionDependenciesRealtimeListener` turn them into `RealtimeEvent`s (`@tomato/constants`):
  - `submission.values` → `board:<boardId>`: `{ id, boardId, data, dataDisplays, title, updatedAt }`; the board's submission table merges it into its row.
  - `submission.summary` → `submission:<id>`: `{ id, title, updatedAt }`; the dependency graph patches the node's title.
  - `submission.graph-changed` → `submission:<id>`: `{ id }`, when its edges changed (as source) or it was deleted; the graph of every node is refetched.
- Web: `shared/lib/realtime` keeps one `EventSource` on `/rest/core/realtime` for the union of the rooms joined by `useRealtimeRooms(rooms)` (ref-counted), reopens it when that set changes (the old stream closes once the new one is open), and hands each event to `useRealtimeEvent(event, listener)`.

## Behaviors

- A template snapshot carries `behaviors: { [widgetId]: WidgetBehaviorType[] }`, written by the editor when a widget of a type with behaviors is added (and dropped when it is removed).
- On `PUT /submissions/:id/values`, the pushed values are merged into an `ApplyChangesContext`, then `SubmissionBehaviorsService.applyBehaviors` runs the behaviors of every widget whose clock changed and whose merged value is truthy, and finally the values and `data_displays` are stored.
- `refer-submission`: syncs its edges with the ids of its linked `users` widget (`linkWidgetUuid`; a value that is not an array → `400 VALIDATION_FAILED`). It deletes the target submissions of deselected ids, then creates, on the same board, one empty submission of the newest published version of its linked template (`linkTemplateUuid`) per new id, together with its edge. A template not linked to the board or unpublished is logged and skipped so the push still saves its values.

## Web

- `modules/board`: `/system/boards` (list, create, delete) and `/system/boards/[id]` with two tabs: **Submissions** (table driven by the columns, new / delete submission) and **Columns** (link templates, edit columns).
- `modules/submission`: `/submissions/[id]` fills the submission in realtime. It renders the version snapshot with `TemplateForm` (from `template-form`: sessions shown by their condition, controlled widgets, a canvas's widgets inside the canvas) over the submission document.
- A `refer-submission` widget builds its own keys: `refer = toSubmissionRefer(submissionId, widgetId)` and one `idempotencyKey` per user of its linked `users` value. It shows, before it runs, one step per key from `useDependenciesByRefer(refer)`: **created** (selected, edge exists), **will create** (selected, no edge) and **will delete** (edge of the refer whose key is no longer selected). `Apply` is enabled only when there is a change and writes the click time as the widget value. Until the graph shows no change, for at most `REFER_SUBMISSION_APPLY_TIMEOUT_MS` (30s) after the click, the pending steps spin; the graph refreshes itself when the api reports the new edges. After that they fall back to their pre-status, so a skipped run (template not linked) can be applied again. The widget is top-level only: the editor keeps it out of canvases, mixed and repeat views, since the behavior reads `values[widgetId]`.

## Known gaps

- No views (charts / calendar), discussion or history tabs on the board.
- No mail action, `users` / `submitted-by` values or search indexing; those widgets cannot fill a column. Button mail actions still only warn.
- No endpoint to create or delete dependencies: edges are only created and deleted by the `refer-submission` widget, or deleted with their submissions.
- No generic "update submission data" endpoint: values only arrive through collab.
- Lists load a single page (up to 100 boards / submissions).
