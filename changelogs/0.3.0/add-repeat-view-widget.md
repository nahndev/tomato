# Add the `RepeatView` widget: a `MixedView`-like container whose views repeat one session

## Currently

- `MixedView` (`WidgetType.MIXED_VIEW`, [add-mixed-view-widget.md](./add-mixed-view-widget.md)) is a container widget that shows tabs; every tab is its own `Session` with its own grid of widgets:
  - the tabs are stored in `Widget.tabs?: Session[]` ([template-editor.types.ts](../../apps/web/src/shared/types/template.types.ts)), created by `WidgetHandler` ([widget-handler.ts](../../apps/web/src/modules/template-editor/sync/handlers/widget-handler.ts)) from `DEFAULT_TAB_NAMES`, and edited through the `TABS` property ([property-registry.ts](../../apps/web/src/modules/template-editor/components/property/property-registry.ts))
  - rendered by `MixedViewWidgetItem` ([mixed-view-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/mixed-view-widget-item.tsx)); in the form, `FormMixedViewWidgetItem` ([form-container.tsx](../../apps/web/src/modules/template-form/components/form-container.tsx)) mounts every tab and wraps it in `DataScopeProvider` ([data-scope.tsx](../../apps/web/src/modules/template-form/components/data-scope.tsx)) with scope `[mixedViewId, tabSessionId]`, so values are saved under `[mixedViewId, tabSessionId, childWidgetId]`
  - registered as a container in `CONTAINER_WIDGET_TYPES` ([template-widget.constants.ts](../../apps/web/src/modules/template-widget/template-widget.constants.ts)) and in the widget registries (`widget-registry.ts`, `widget-items.constants.ts`, `widget-settings.constants.ts`, `widget-layouts.constants.ts`, board `widget-value-types.constants.ts`)
- The views of a `MixedView` are fixed by the template author: each tab has different widgets, and the person filling the form cannot add or remove one.
- There is no way to fill in the same group of fields once per item of another widget (e.g. one block per option of a select, or one block per selected user), so templates have to repeat the same widgets by hand for each item.

## Acceptance Criteria

- [x] Add new widget type `RepeatView`
- [x] Add new property `linkWidgetUuid` accept a widget with data-type is `users`, `options` -> build into `tabs`
- [x] ~~When `linkWidgetUuid` set -> create `session` for this ui~~ the `session` is created when the repeat view is added, like `canvas`
- [x] The scope is [widgetId, tabId]

## Solutions

- [x] Model: `WidgetType.REPEAT_VIEW` (`repeat-view`) in `@tomato/constants`; full width, listed in `CONTAINER_WIDGET_TYPES`; linkable widgets are `REPEAT_LINK_WIDGET_TYPES` (`select`, `checkbox`, `radio`, `users`)
- [x] Links: a new doc map `TemplateDocKey.LINKS` (`links`), also in `TemplateSnapshot.links` (optional: older published snapshots have none) and in the collab snapshot, keyed by the linking widget: `{ [repeatViewId]: { [LinkTargetType.WIDGET]: { uuid: <linkedWidgetId>, onDelete: LinkDeleteAction.CASCADE } } }`: `WidgetLink = Partial<Record<LinkTargetType, LinkTarget>>` in `template.types.ts` (web) / `template-editor.types.ts` (api) / `template.types.ts` (collab), at most one link per target type, so more link types can be added later; the link is not a widget property
- [x] `LinkHandler`: `setLink(widgetId, type, target | undefined)` writes / removes one type's link (keeping the others, dropping the entry once empty); `setWidgetLink(widgetId, uuid | undefined)` is its `widget` + `cascade` shortcut; on `WidgetRemovedEvent` it drops the removed widget's own links and removes every widget whose `widget` link targets it with `onDelete: cascade`
- [x] Tabs are derived, not stored: `useRepeatTabs(linkWidgetUuid)` (reads the widget from `WidgetsProvider`, which carries `{ widgets, links }` and is provided by the editor and the form; memoized on the options) maps the linked widget's `options` (in `index` order) to `{ id: option.key, name: option.value }`, so renaming / reordering / removing an option updates the tabs
- [x] `template-widget`: `WidgetTabs` extracted from `MixedViewWidgetItem` and shared with the new `RepeatViewWidgetItem` (reads its link with `useWidgetLink(widget.id)`, `children(tab, columnWidth)`)
- [x] Editor: `LinkWidgetDescriptor`, rendered by the property panel for repeat views (outside the property registry, since the link is not a property), picks the linked widget through `useLinkActions`, excluding widgets inside the repeat view itself; `WidgetHandler.addWidget` creates `widget.session` right away, like `canvas`, so linking / unlinking never touches the widgets inside; `EditorRepeatViewWidgetItem` edits that one session in the active tab; the copilot context gives a repeat view its `linkedWidgetId`
- [x] Form: `FormRepeatViewWidgetItem` mounts every tab, each wrapped in `DataScopeProvider scope={[widget.id, tab.id]}`, so values are saved under `<repeatViewId>.<optionKey>.<childWidgetId>`; `FormContainer` ids its grid by the scoped key, since the same session is mounted once per tab
- [x] Not covered: the `users` widget is still a placeholder with no items, so a repeat view on it has no tabs until a users module exists; inputs keep `id={widget.id}`, so the same widget mounted in several tabs repeats that DOM id (a label focuses the first tab's input); same `SubmissionsService.applyValues` / session condition limits as `MixedView` for scoped values
