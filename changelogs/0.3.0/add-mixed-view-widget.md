# Add the `MixedView` widget: a tabs view where each view is one session

## Currently

- `canvas` (`WidgetType.CANVAS`) is the only container widget (`CONTAINER_WIDGET_TYPES` in [template-widget.constants.ts](../../apps/web/src/modules/template-widget/template-widget.constants.ts)). It holds exactly **one** content session:
  - `Widget.session?: Session` in [template-editor.types.ts](../../apps/web/src/shared/types/template.types.ts), with `Session.nested = { type: SessionNestedType.WIDGET, uuid: widgetId }`
  - created in `WidgetHandler` ([widget-handler.ts](../../apps/web/src/modules/template-editor/sync/handlers/widget-handler.ts)) when the widget is added; removing the widget also removes the widgets of that session
  - rendered by `EditorCanvasWidgetItem` ([editor-canvas-widget-item.tsx](../../apps/web/src/modules/template-editor/components/widget/editor-canvas-widget-item.tsx)) as a nested `SessionCanvas` in the editor, and by `FormWidget` / `FormContainer` ([form-container.tsx](../../apps/web/src/modules/template-form/components/form-container.tsx)) in the form
- Code that walks container content assumes a single session per container widget: `findContainerWidgetId` / `getTopSessionId` ([container.ts](../../apps/web/src/modules/template-widget/utils/container.ts)), the structure panel ([structure-toolbar-box.tsx](../../apps/web/src/modules/template-editor/components/toolbar/structure/structure-toolbar-box.tsx)), the copilot context ([copilot-template-context.ts](../../apps/web/src/modules/template-editor/sync/copilot/copilot-template-context.ts)) and the snapshot in `apps/collab` ([template.service.ts](../../apps/collab/src/modules/template/template.service.ts)).
- There is no way to split a group of widgets into several views and switch between them in the same place of a session (e.g. "Personal info" / "Address" / "Documents" tabs), so long forms have to stack everything vertically.
- Goal: add a new container widget `MixedView` that shows tabs; every tab (`View`) is its own `Session` with its own grid of widgets. Views can be added, renamed, reordered and removed; widgets can be dropped, moved and resized inside the active view, in the editor and in the form (submission).

## Acceptance Criteria

- [x] Add new `MixedView` widget, it is component same `Tabs`, every `TabsContent` is a session (same as `canvas` width)
- [x] Every tab is loaded from a `tabs` property (a list of sessions, added / renamed / reordered / removed like options) instead of `options`
- [x] For form, it will render all tabs
- [x] Every `TabContent` wrap by `DataScopeProvider` with scope value. ex: [mixedViewId, tabSessionId, childWidgetId] and `onChange` instead of only id, using onChange(key, next, scope)

## Solutions

- [x] Model: `WidgetType.MIXED_VIEW` (`mixed-view`) in `@tomato/constants`; `WidgetProperties.tabs?: Session[]` in `template.types.ts` (web) / `template-editor.types.ts` (api) / `template.types.ts` (collab) (tab order = array order, each tab's `nested.uuid` = the widget id); full width like `canvas`, listed in `CONTAINER_WIDGET_TYPES`
- [x] `template-widget`: `MixedViewWidgetItem` (shadcn `Tabs`, `children(session, columnWidth)` per tab, `isAllMounted` keeps every tab mounted); `useColumnWidth` shared with `CanvasWidgetItem`; `createContentSession` / `getContentSessions` so `findContainerWidgetId` / `getTopSessionId` also find a tab's session
- [x] Editor: `EditorMixedViewWidgetItem` renders the active tab as a nested `SessionCanvas` (disabled while the widget is dragged); `WidgetHandler` creates two tabs on add, removes every tab's widgets with the widget, and removes a tab's widgets when the tab is removed; `TabsDescriptor` (property `tabs`) adds / renames / reorders / removes tabs; structure panel lists widgets under each tab name; copilot context describes `tabs`
- [x] Form: `DataScopeProvider` / `useDataScope` (scope appended to the enclosing one); `FormField` reads `values[key]` and calls `onChange(key, next, scope)` with `key = scope.join(".")` (a top-level widget keeps its id as key); `FormMixedViewWidgetItem` mounts every tab, each wrapped in `DataScopeProvider scope={[widget.id, tab.id]}`
- [x] Not covered: `SubmissionsService.applyValues` keeps skipping keys that are not widget ids, so scoped values stay in the submission doc only (no `data` / `dataDisplays` / board cell); a session condition on a widget inside a tab reads its top-level id, so it never matches
