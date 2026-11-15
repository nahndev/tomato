# Add a `Boards` group to the sidebar menu

## Currently

- The system sidebar (`AppSidebar` → `SidebarNav`) renders the groups declared in `SYSTEM_NAV_ITEMS` (`modules/system/system.constants.ts`): `Forms` (Boards, Templates) and `Management` (Maps, Settings).
- Boards only appear as one static `Boards` item in the `Forms` group, linking to `/system/boards` (the board list page); the individual boards (`/system/boards/[id]`) are not reachable from the menu.
- To open a board the user has to go to the board list first and pick it there, every time.
- `SidebarNav` only supports static groups: each `SystemNavGroup` has a fixed `children` list of `SystemNavLink` (label, href, icon), and an optional group `href` that makes the group label a link. Nothing in the menu is loaded from the API.
- The board list is already available on the web through `useBoards()` (`modules/board`, query key `boardKeys.all`, `listBoards` service).

## Acceptance Criteria

- [x] Add new group `Boards` in app-sidebar
- [x] Load all boards and show on board
- [x] Add new page `BoardSubmissionPage`, when click item show `BoardSubmissionPage` as page -> split into module board
- [x] Update `/system/boards/:id` display only columns -> split into module board-editor

## Solutions

- [x] `board`: `BoardMenu` (`useBoardMenu`, own query key `boardKeys.menu()` like `DepartmentMenu`) renders a `Boards` `SidebarNav` group with one item per board linking to `/system/boards/[id]/submissions`; mounted in `app/system/layout.tsx` before `DepartmentMenu`; creating / deleting a board refreshes it (`boardKeys.all` prefix)
- [x] `board`: `BoardSubmissionPage` (board name, `BoardSubmissions`) on the new route `/system/boards/[id]/submissions`; `BoardDetail` and its tabs (`BoardTab`) removed
- [x] New web module `board-editor`: `BoardEditorPage` (back to `/system/boards`, `ColumnSetting` only) on `/system/boards/[id]`; the column components, `WIDGET_VALUE_TYPES`, widget-option utils, `ColumnDraft`, the draft column utils and the editor labels / size steps moved from `board`; `board` keeps the data layer and exposes `useBoard`, `DEFAULT_COLUMN_SIZE` and the board types through `index.ts`
