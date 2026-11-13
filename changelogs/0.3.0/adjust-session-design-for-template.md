# Adjust session design for template

## Currently

- The template editor renders top-level sessions in `SessionList` ([session-list.tsx](../../apps/web/src/modules/template-editor/components/session/session-list.tsx)): a `ScrollArea` on `bg-muted` with a vertical stack (`gap-10 p-10`), one `SessionBox` per session, and an "Add Session" button at the bottom in edit mode.
- `SessionBox` ([session-box.tsx](../../apps/web/src/modules/template-editor/components/session/session-box.tsx)) is a centered card (`rounded-lg bg-card p-4 shadow-card`) whose width comes from the grid inside it (`GRID_COLUMNS × columnWidth` in `@tomato/grid`), so it stays fixed and does not follow the width of the editor workspace.
- `SessionHeader` ([session-header.tsx](../../apps/web/src/modules/template-editor/components/session/session-header.tsx)) puts the `IconPicker` (outline icon button, defaults to a muted clock icon), the `SessionNameInput` (transparent `text-2xl` input) and the `SessionSettingPopup` trigger in one row with a bottom border. The header looks the same in edit and preview modes: the icon picker, name input and settings button stay visible and interactive in preview.
- `SessionGrid` ([session-grid.tsx](../../apps/web/src/modules/template-editor/components/session/session-grid.tsx)) renders the widgets through `ContainerLayout` from `@tomato/grid`; the grid lines show in edit mode only.
- `AddSessionButton` ([add-session-button.tsx](../../apps/web/src/modules/template-editor/components/session/add-session-button.tsx)) is a small outline button centered under the last session, visually detached from the session cards.

## Acceptance Criteria

- [x] For `template-editor` and `template-form`
- [x] Update session layout with header as `header/footer` in MSWord (small, on top, transparent, ...)
- [x] Icon of session display before session name
- [x] Setting button should show outbox of session, right on top

## Solutions

- [x] New shared `SessionFrame` ([session-frame.tsx](../../apps/web/src/shared/components/session-frame.tsx)): a small, transparent, muted header row above the card (`header` on the left, `actions` on the right), then the card with the grid. `SessionBox` (editor) and `FormSessionBox` (form) both render through it, so the two stay identical
- [x] Editor: `SessionHeader` only renders the icon + name; `IconPicker` and the settings button become `ghost` `icon-xs`, `SessionNameInput` drops from `text-2xl` to a muted `text-sm`. `SessionSettingPopup` moves to the frame's `actions`, outside the card at the top right
- [x] Form: icon + session name in the same header row, no bottom border inside the card
- [x] A session without an icon falls back to `DEFAULT_SESSION_ICON` (`template-widget`) in both the editor picker and the form, so the form always shows one
