# Support component with container layout in session-canvas

## Currently

- `SessionCanvas` (`template-editor/components/session/session-canvas.tsx`) renders one `ContainerLayout` (`@tomato/grid`) per session. Every widget inside it is a leaf: `WidgetItem` → `WidgetView` → the field component from the `template-widget` registry
- Layout data is one level deep:
  - `layouts: Record<widgetId, GridLayout>` (`column`, `span`, `idx`, `isStatic`, `isFullWidth`)
  - `widgetToSession: Record<widgetId, sessionId>`: the session is the only kind of container
  - `LayoutHandler.setLayout(widgetId, sessionId, patch)` / `getWidgetIdsForSession(sessionId)` assume the parent is always a session
- The `session` widget type (`WidgetType.SESSION`, "Full-width, fixed block", `isFullWidth`, span 4) exists, but `SessionWidgetItem` only draws a dashed placeholder. It cannot hold other widgets
- There is no way to group widgets inside a session (for example a boxed block with its own columns and background) and move them as one block
- Limits of the current code if a widget hosts its own `ContainerLayout`:
  - in the builder, `WidgetBox` renders the widget preview `inert`, so a nested grid inside it cannot receive drops, drags or resizes
  - `ContainerLayout` only handles a drop when it is the drop target (`isDropTarget`) and reports `onMoving(id, column, idx)` without the source container, so moving a widget between a session and a nested container (or between two containers) is not supported
  - nested `useDroppable` areas inside another droppable: the inner one must win the drop
  - everything that walks the layout assumes sessions: `TemplateForm` / `FormSession` (submission), copilot context (`orderedSessionWidgets`), `removeSession` (deletes the session's widgets), the snapshot export in `apps/collab`
- Goal: a widget type can host a `ContainerLayout` inside `SessionCanvas`. Widgets can be dropped, moved and resized inside it and moved in and out of it, and the same nesting renders in `TemplateForm` (submission) and in view mode

## Acceptance Criteria

- [x] Create new widget type `canvas`
- [x] The `Canvas` include `title` and `content`
- [ ] The `content` allow drag and drop some `widget` as children of `Canvas`
- [x] The `content` is `Session` with record `nested: { type: widget, uuid: ....}`

## Solutions

- [x] `WidgetType.CANVAS` (`@tomato/constants`): group advance, full width, settable `label` (the title); `canvas` in every widget registry (board value types: none; left out of the api-call pickers)
- [x] Content = a `Session` stored in the canvas widget (`WidgetProperties.session`, with `nested?: { type: SessionNestedType.WIDGET, uuid }`), not in the `sessions` map, so `sessions` stays sections only. `WidgetHandler.addWidget` creates it; `removeWidget` on a canvas removes the widgets inside; children use `widgetToSession` like any widget, so the doc schema and the collab snapshot are unchanged
- [x] `findContainerWidgetId` / `getTopSessionId` (`template-widget`) map a content session back to its canvas and the canvas's session (session condition picker, copilot selection); copilot `setWidgetLayout` accepts a canvas's `content.sessionId`
- [x] `@tomato/grid`: `options.columnWidth` (inner grid keeps 8 columns, narrower), `isNested` (pointer-only collision at `CollisionPriority.Highest`, so the inner grid wins the drop); each `ContainerLayout` provides its settings (`columnWidth`, `isGridVisible`, `isDisabled`, `isNested`) through `ContainerSettingsProvider`, read with `useContainerSettings` by `ContainerGrid`, `ResizableBox`, `ItemLayout`; new deps `@dnd-kit/abstract`, `@dnd-kit/collision`
- [x] `template-widget`: `CanvasWidgetItem` (title + content, measures its width) renders the host's component from `WidgetContainerProvider`: editor `NestedSessionCanvas` (`SessionCanvas` for the nested session), form `FormContainer`; the builder's `WidgetBox` is not `inert` for containers and stops click propagation so a child selects itself
- [x] Structure panel and copilot context list a canvas's widgets under it (`content.sessionId`); `setWidgetLayout` moves a widget into a canvas through that session id
- [x] Tests: grid `columnWidth`, canvas lifecycle (`session-handler.spec`), copilot context, `TemplateForm` canvas rendering; docs `template-editor.md`, `board-submission.md`
