# Add a `Button` widget group

## Currently

- Widget groups are the `WidgetGroup` constant in [template-editor.constants.ts](../../packages/constants/src/template-editor.constants.ts): `common`, `media`, `advance`, `system`, `default`.
- Each widget picks its group in `WIDGET_ITEM_META` ([widget-items.constants.ts](../../apps/web/src/modules/template-widget/constants/widget-items.constants.ts)). The same file holds the toolbar labels (`WIDGET_GROUP_LABELS`) and the order of the sections (`WIDGET_GROUP_ORDER`: common, media, advance, system; `default` is not listed, so its widgets are not shown).
- `WidgetToolbar` ([widget-toolbar.tsx](../../apps/web/src/modules/template-editor/components/toolbar/widget/widget-toolbar.tsx)) shows one section for each group in `WIDGET_GROUP_ORDER`, with that group's widgets.
- The two button widgets, `Button` (`WidgetType.BUTTON`) and `Submit Button` (`WidgetType.SUBMIT_BUTTON`), are both in `advance`. That group also holds unrelated widgets: Signature, Break, Session, Canvas, Mixed View, Repeat View, Refer Submission. So the button widgets are hard to find, and new button widgets would go into the same mixed list.
- `group` is only used to build the toolbar. The template data does not store it, so moving a widget to another group does not change any saved template.

## Acceptance Criteria

- [ ] Make new group for widgets `Buttons`
- [ ] Move widgets to `button` group

## Solutions

- [x] `WidgetGroup.BUTTON` (`'button'`) in `@tomato/constants`, labelled "Buttons" in `WIDGET_GROUP_LABELS`
- [x] `WIDGET_GROUP_ORDER`: common, button, media, advance, system
- [x] `Button` and `Submit Button` moved from `advance` to `button`; saved templates are unaffected since `group` is not stored
