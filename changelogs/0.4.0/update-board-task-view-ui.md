# Update the board UI of the task view

## Currently

- The board page `/system/boards/[id]/submissions` (`BoardSubmissions`, module `board`) renders `BoardTaskView` (`components/views/board-task-view.tsx`) when `?view=task`, with the `board` and the `submissions` returned by `GET /boards/:id/views/task/submissions` (already filtered by each template's `conditions`).
- `BoardTaskView` renders a flat `<ul aria-label="Tasks">` card (`rounded-lg bg-card shadow-card`) with one `TaskItem` per submission, in the order the API returns them; there is no grouping (e.g. by `status` or `type`), no sorting, no header row and no count per group. With no submission it only shows "No tasks."
- `TaskItem` (`components/views/task-item.tsx`) is a single row `type - title - status - assignee`, styled like a table row (`border-b px-4 py-2 text-sm hover:bg-muted`):
  - `type`: an `outline` `Badge`, hidden when empty, so the titles do not line up between rows with and without a type.
  - `title`: a `Link` to the submission (`getSubmissionPath`) stretched over the whole row (`after:absolute after:inset-0`), truncated.
  - `status`: a default `Badge` with the same color for every value, hidden when empty.
  - `assignee`: plain names joined with `, ` in a fixed `w-40` column, or "Unassigned"; no avatar.
- The values come from `getTaskItem` (`utils/task-item.ts`): `type`, `title`, `status` are labels read with `getWidgetLabel` from `Submission.dataDisplays`, the title falls back to `submission.title`, then the template name, then "Untitled"; `assigneeIds` are mapped to names with `useAllUsers` / `getUserFullName` (unknown ids are shown raw).
- The row has no actions: no delete (unlike `BoardTableView`), no quick status or assignee change, no drag and drop; the only interaction is opening the submission.
- The task view does not show the template of a task, its created date or any other widget; option widgets have no color, so every `type` / `status` looks the same.

## Acceptance Criteria

- [x] Improve UI of `TaskItem`
  - [x] Fix size of `type` and `status`
  - [x] The `type` should editable
  - [x] The `title` should editable
  - [x] The `status` should editable
  - [x] The `assignee` should add `Assignee` component, allow edit assignee.
  - [x] More padding, improve color, padding, margin, rounded, ...

- [x] The server `collab` add new endpoint allow send updated (as list actions) with http endpoint, `collab` update for docs

## Solutions

- [x] `TaskField` (`type`, `title`, `status`, `assignee`; `@tomato/constants`) names what the task view edits
- [x] api: `PATCH /boards/:id/views/task/submissions/:submissionId` `{ type?, title?, status?, assignee? }` (`BoardTaskController`, `UpdateTaskDto`, `BoardTaskService.updateTask`): gets the board and the submission, builds `widgetId → value` changes with the static `JsonBoardTaskView` (`@tomato/utils`) over `taskSetting[templateId]` (a field without a widget is skipped) and sends them to collab (`SubmissionValuesClient`)
- [x] collab: `PATCH /submissions/:id/values` `{ values }` (module `submission-values`, `class-validator`, global `ValidationPipe`) sets each value in the Yjs document with `CollabGateway.updateDocument` (direct connection, stored and pushed to the api on disconnect)
- [x] web: `updateTask` (api, through `/rest/core`) + `useBoardSubmissions().update` (refetch on success)
- [x] web: `TaskItem` card (border, rounded, padding, shadow) with fixed-width `TaskOptionSelect` for type / status, inline `TaskTitle`, `Assignee` avatar stack + popover; a change shows at once and stays until the refetch
