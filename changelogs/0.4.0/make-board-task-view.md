# Make the task view for the board

## Currently

- The board page `/system/boards/[id]/submissions` (`BoardSubmissions`, module `board`) switches between the views the board has (`BoardView`: `table`, `task`, `agenda`; `@tomato/constants`) with `BoardViewToggle` and `?view=`; the task view shows `ListTodoIcon` in the switcher.
- `BoardTaskView` (`components/views/board-task-view.tsx`) is a placeholder: it takes no props and only renders "The task view is not set up yet." `BoardSubmissions` renders it without the board or its submissions, unlike `BoardTableView` (`board`, `columns`, `submissions`, `onDelete`).
- The task view is stored in `board_tasks` (`BoardTask`, one per board, cascade) with only `boardId`, `createdAt` and `updatedAt`, so there is no setting yet (e.g. which widget gives a task's status, due date or assignee). `PUT /boards/:id/views/task` adds it (no body), `DELETE /boards/:id/views/task` removes it; there is no endpoint to save its settings, unlike the table view's `columns`.
- `BoardTaskViewSettingPage` (`board-editor`, `/system/boards/[id]/settings/task`) only adds or removes the view (`ViewSettingSection`) and shows "Not available yet."
- A board column maps one widget per template (`BoardColumn.items`: `templateId` → `widgetId`, `property`), and values are read from `Submission.dataDisplays` (`DisplayBucket`: `entity`, `date`, `text`); the task view has no such mapping.
- `docs/board-submission.md` lists it as a known gap: "The task and agenda views (and their settings) are placeholders".

## Acceptance Criteria

- For edition
- [x] Setting with the `type` is option widget
- [x] Setting with the `title` is text widget
- [x] Setting with the `status` is option widget
- [x] Setting with the `assignee` is user widget
- [x] Setting with the `conditions` include `widget` and `value`
  - widget support options widget only for now
  - Example: widget is status and condition is `not is` the `success`

- For creation
- [x] Show list item with `type - title - status - assignee`
- [x] Add endpoints allow search with conditions

## Solutions

- [x] The UI config add setting UI for every templates
- [x] Table `BoardTemplateTaskSetting` (one per linked template, cascade from `BoardTemplate` and `BoardTask`) with typeWidget, titleWidget, statusWidget, assigneeWidget, conditions
- [x] The `conditions` save as json with `{widget, operation, value}
- [x] The get endpoints return list submission pass conditions
- [x] On front-end, build `TaskItem` in List (like jira) with `type`, `title`, `assignee`, `status` from values of `submissions`
