# Add `conditions` property to the button widget

## Currently

- The `button` widget (`WidgetType.BUTTON`) is configured from the property panel with `[LABEL, ACTIONS, TEXT_STYLE, CONTAINER_STYLE]` ([template-editor.constants.ts](../../apps/web/src/modules/template-editor/template-editor.constants.ts)); `WidgetProperties` ([template.types.ts](../../apps/web/src/shared/types/template.types.ts)) has no property to decide when a button can be used.
- `ButtonWidgetItem` ([button-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/button/button-widget-item.tsx)) is always enabled and visible: a click always calls `onChange(true)` and then runs every action in `actions` (`ButtonActionType`: `link`, `mail`, via `useRunButtonAction` / `ButtonActionProvider` in [button-action-provider.tsx](../../apps/web/src/modules/template-widget/components/actions/button-action-provider.tsx)), whatever the rest of the form contains.
- The only condition model in templates is on sessions: `SessionProperties.condition?: SessionCondition` with one rule per session (`SessionConditionType`: `always`, `button-clicked`, `widget-has-value` in [template-editor.constants.ts](../../packages/constants/src/template-editor.constants.ts)), each pointing to a single `widgetId`.
  - Evaluated in the form by `evaluateSessionCondition` ([session-condition.ts](../../apps/web/src/modules/template-form/utils/session-condition.ts)) against the top-level `values` (scoped values inside `mixed-view` / `repeat-view` never match).
  - Edited in `SessionSettingPopup` ([session-setting-popup.tsx](../../apps/web/src/modules/template-editor/components/session/session-setting-popup.tsx)), mirrored in the api types ([template-versions.types.ts](../../apps/api/src/modules/template-versions/template-versions.types.ts)) and described to the copilot as `showWhen` ([describe-template.ts](../../apps/web/src/modules/template-editor/copilot/utils/describe-template.ts)).
- So a template cannot express "this button is only usable once required fields are filled / another button was clicked" (e.g. a "Send mail" button that must not fire before the recipient or signature is set); the author can only hide the whole session that contains the button.

## Acceptance Criteria

- [ ] Add new properties `Conditions` is list checkbox
  - [ ] Must all required widget must apply (improve description)
  - [ ] All required
- [ ]

## Solutions

- [ ] Add new property `conditions` should is `object` with {key: value}
- [ ] `key` is string and is type of condition
- [ ] `vale` is object and is meta of condition, default is empty
