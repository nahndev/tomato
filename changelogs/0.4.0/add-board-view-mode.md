# Add a view mode to the board page, table by default

## Currently

- The board page `/system/boards/[id]/submissions` (`BoardSubmissionPage`, module `board`) shows the board name and `BoardSubmissions`: the submission count, a `New submission` button and one fixed view, `SubmissionTable`.
- `SubmissionTable` is the only way to see submissions: a `Title` column, one column per board column (sized by `getColumnSizeStyle`, cells from `formatCell` over `dataDisplays`), the template name and a delete action; a row links to `/submissions/[id]`.
- The board has no notion of a view: `Board` (`board.types.ts`) and the `boards` table only store `name`, `columns` and linked templates, and there is no constant or switcher for a view mode.
- `docs/board-submission.md` lists it as a known gap: "No views (charts / calendar), discussion or history tabs on the board."
- A similar switch already exists for templates: `TemplateLayout` (`GRID`, `LIST`, `as const`) with `TemplateLayoutToggle` (icon buttons, `aria-pressed`), kept in local `useState` in `TemplateBrowser`, so it is not remembered after a reload.

## Acceptance Criteria

- [x] Make `BoardTableView` with config of columns
- [x] Make `BoardTaskView` with config for agenda
- [x] Create `BoardTemplateSettingPage` to setup template for board
- [x] Create `BoardTableViewSettingPage` to setup table-view for board (using current)
- [x] Create `BoardTaskViewSettingPage` to setup task-view for board (structure only, handler later)
- [x] Create `BoardAgendaViewSettingPage` to setup agenda-view for board (structure only, handle later)

## Solutions

- [x] `board`: `BoardView` (`table`, `task`, `agenda`, `as const`); `/system/boards/[id]/submissions` reads `?view=` (unknown or missing → `table`) and `BoardSubmissions` switches with `BoardViewToggle` (icon buttons like `TemplateLayoutToggle`, `router.replace`, no `?view` for `table`)
- [x] `board`: `SubmissionTable` → `BoardTableView` (`components/views`, driven by the board columns); `BoardTaskView` and `BoardAgendaView` are empty-state placeholders
- [x] `board-editor`: settings routes `/system/boards/[id]/settings/{templates,table,task,agenda}` under `BoardSettingsLayout` (back link, board name, side menu `BOARD_SETTING_SECTIONS` like the department workspace); `/system/boards/[id]` redirects to `settings/templates`
- [x] `BoardTemplateSettingPage` (`TemplateSetting`, saves `templateIds` only; the api prunes the column items of unlinked templates) and `BoardTableViewSettingPage` (`TableViewSetting`, the former column editor, saves `columns` only) split the former `ColumnSetting`; `BoardTaskViewSettingPage` and `BoardAgendaViewSettingPage` are structure only
