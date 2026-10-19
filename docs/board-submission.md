# Board and submission

Ported from `tomato-form2` (`server/src/{board,submission}`, `website/src/features/{board,submission}`). A board links templates; a submission is based on a published **template version**.

## Model

| Table             | Content                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `boards`          | `name`, `columns` (jsonb `BoardColumn[]`)                                                         |
| `board_templates` | links a board to the **templates** it collects submissions for (cascade on both sides)            |
| `submissions`     | `board_id`, `template_version_id` (restrict), `data`, `data_clocks`, `data_displays` (all jsonb) |

- A board links **templates**; a submission is based on a **template version**. Creating a submission picks a linked template and freezes its newest published version (`409` if it has none). The submission's template is reached through its version (`Submission.templateId`).
- A board column has a `label`, a `DisplayType` (`text`, `date`, `time`, `datetime`, `number`), a `size` (`{ width }` px or `{ flex }` fr) and `items`: `templateId → { widgetId, property }` (the widget, and which value property of it, to show for submissions of that template). All widgets of a column share the display type. The widget picker reads the newest published version of each linked template; a submission on an older version shows an empty cell when that widget no longer exists.
- `property` is a `ValueType`: `default`, plus `date` / `time` for `datetime` widgets. Which widgets can fill a column, and as which display types, is `WIDGET_VALUE_TYPES` (web, `board/constants`).
- `data_displays` is derived from `data` and the version snapshot on every change: `widgetId → property → { entity?, date?, text? }` (`apps/api/.../submissions/display`), backfilled for every widget so the board renders cells without null checks.

## API

| Method | Path                      | Notes                                                                                |
| ------ | ------------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/boards`                 | paginated `BoardSummary` (name, template count)                                      |
| GET    | `/boards/:id`             | `Board`: columns + linked `templates` (id, name, `latestVersion` with snapshot or `null`) |
| POST   | `/boards`                 | `{ name, templateIds?, columns? }`                                                   |
| PATCH  | `/boards/:id`             | partial; unlinking a template prunes its column items                                |
| DELETE | `/boards/:id`             | cascades to the submissions                                                          |
| GET    | `/submissions?boardId=`   | paginated `Submission[]` of a board                                                  |
| GET    | `/submissions/:id`        | `SubmissionDetail` = submission + its `templateVersion`                              |
| POST   | `/submissions`            | `{ boardId, templateId }`; the template must be linked to the board and published    |
| PUT    | `/submissions/:id/values` | `204`; called by collab (see below)                                                  |
| DELETE | `/submissions/:id`        |                                                                                      |

Validation errors → `400 VALIDATION_FAILED` (a column that references an unlinked template, an unknown template id, a bad size, …); unknown ids → `404 NOT_FOUND`; a template without a published version → `409 CONFLICT`.

## Realtime values

- A submission is filled in through a Yjs document `submission/<submissionId>` on the collab websocket (same server and file storage as the template drafts). Its `values` map is `widgetId → value` (`SubmissionDocKey`).
- When collab stores a submission document (debounced 1s, max 5s) it `PUT`s every value with the Yjs item clock of the key to `${API_URL}/submissions/:id/values`. The api rewrites a key only when its clock changed, ignores keys that are not widgets of the version, then rebuilds `data_displays`. A failed push is logged and retried by the next store.

## Web

- `modules/board`: `/workspace/boards` (list, create, delete) and `/workspace/boards/[id]` with two tabs: **Submissions** (table driven by the columns, new / delete submission) and **Columns** (link templates, edit columns).
- `modules/submission`: `/submissions/[id]` fills the submission in realtime. It renders the version snapshot with `TemplateForm` (from `template-editor`: sessions shown by their condition, controlled widgets) over the submission document.

## Known gaps

- No views (charts / calendar), discussion or history tabs on the board.
- No mail action, `users` / `submitted-by` values (there is no users module) or search indexing; those widgets cannot fill a column. Button mail actions still only warn.
- No generic "update submission data" endpoint: values only arrive through collab.
- Lists load a single page (up to 100 boards / submissions).
