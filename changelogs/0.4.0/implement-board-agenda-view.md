# Implement the agenda view for the board

## Currently

- The board page `/system/boards/[id]/submissions` (`BoardSubmissionPage`, module `board`) switches between the views the board has (`BoardView`: `table`, `task`, `agenda`; `@tomato/constants`) with `BoardViewToggle` and `?view=`. The agenda view shows only when `agendaSetting` is not empty, so it is hidden on every board today.
- `BoardAgendaView` (`components/views/board-agenda-view.tsx`) is a placeholder: it takes no props and only renders "The agenda view is not set up yet." It gets neither the board nor its submissions, unlike `BoardTableView` and `BoardTaskView`.
- The agenda setting is stored on the board (`boards.agenda_setting`, jsonb, default `{}`) and typed as `Record<string, unknown>` (`BoardEntity.agendaSetting`); there is no shape for it (e.g. which widget gives a submission's date) and `BoardWriteData` has no `agendaSetting`.
- Unlike `PUT /boards/:id/views/table` and `PUT /boards/:id/views/task`, there is no endpoint to save the agenda setting, and unlinking a template does not prune it.
- `GET /boards/:id/views/agenda/submissions` (`BoardAgendaService`) returns `404` while the setting is empty, otherwise lists every submission of the linked templates with no conditions and no date range.
- `BoardAgendaViewSettingPage` (`board-editor`, `/system/boards/[id]/settings/agenda`) only renders `ViewSettingSection` with "Not available yet."
- Date values already exist: `datetime` widgets expose the `date` / `time` properties (`ValueType`), and `Submission.dataDisplays` holds a `date` bucket per widget property, as used by the table view's `date` / `datetime` columns.
- `packages/utils` has `JsonBoardTable` and `JsonBoardTask` to work with the table and task settings; there is no counterpart for the agenda setting.
- `docs/board-submission.md` lists it as a known gap: "The agenda view (and its settings) is a placeholder".

## Acceptance Criteria

- [x] Add new column for `agendaSetting` for board
- [x] Add UI for view agenda for board editor
- [x] Add UI for view agenda for board
- [x] Agenda UI: with columns is date in week
- [x] Agenda UI: with rows is event-bar with start-date -> end-date

## Solutions

- [x] `boards.agenda_setting` (already a jsonb column, no migration) holds `templateId → { titleWidget, startWidget, endWidget }`: `title` a `text` / `text-area` widget, `start` / `end` a `date`, `datetime` or `created-at` widget; no end → a one-day bar. `JsonBoardAgenda` (`@tomato/utils`) prunes it when a template is unlinked
- [x] `board-agenda`: `PUT /boards/:id/views/agenda` (`SaveBoardAgendaDto`, `BoardAgendaRepository`; only linked templates, no duplicates); `GET …/agenda/submissions?from=&to=` keeps the templates with a setting and filters by an optional `SubmissionFilter.range` (`start < to` and `end >= from` or `start >= from`, on `data_displays[widget].default.date`)
- [x] `board-editor`: `AgendaViewSetting`, one `TemplateAgendaSettingCard` per linked template (reuses `TaskWidgetSelect`); a template with a title or end but no start cannot be saved
- [x] `board`: `BoardAgendaView` shows one week (Monday → Sunday) with previous / today / next, a column per day and an `AgendaBar` per submission from start to end, stacked in lanes and clipped at the week edges (`utils/agenda.ts`); refetched on `submission.values` like the task view
