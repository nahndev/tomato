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
- [ ] Base on snapshot, build schema zod, validate value -> disable/active BUTTON
- [ ] Add new widget type `Submit Button` with `Must all required widget must apply` is alway true

## Solutions

- [x] Add new property `conditions` should is `object` with {key: value}: `ButtonConditions = Partial<Record<ButtonConditionType, Record<string, unknown>>>` on `WidgetProperties` (web, api, collab), `PropertyKey.CONDITIONS`, editable on `button` and `submit-button`
- [x] `key` is string and is type of condition: `ButtonConditionType` (`@tomato/constants`), only `required-filled` for now
- [x] `vale` is object and is meta of condition, default is empty: the field and the copilot store `{}`
- [x] Editor: `ConditionsField` lists every condition type as a checkbox with a label and description ("Required fields filled": the button stays disabled until every required field of its session has a value); locked on for a submit button
- [x] Submit button: `WidgetType.SUBMIT_BUTTON` ("Submit Button", group advance, blue "Submit" by default) rendered by `ButtonWidgetItem`, `required-filled` locked on in the editor; counts as a button for the session `button-clicked` condition; board `NONE`
- [x] Copilot: `conditions` described in `PROPERTY_MEANINGS` and settable as a list of types (`toWidgetProperties` turns it into the map)
- [x] Form: `SessionSchemaBuilder` (`template-data/lib/session-schema`) builds the zod schema of one session with a `WidgetSchemaStrategy` per widget type (value widgets add their scoped key, required ones must have a value; canvas and mixed view tabs build their nested sessions); `SessionValidationProvider` (one per `SessionFormBox`) validates the values and provides `useSessionValidity` / `useWidgetValidation`
- [x] Button: `useWidgetConditions` (`template-widget`) evaluates the widget's conditions plus `LOCKED_BUTTON_CONDITIONS`; `ButtonWidgetItem` is disabled while one is not met (enabled in the editor, where nothing is validated) and drops its own colors so the `@tomato/ui` disabled design shows
- [x] Not covered: repeat view tabs are not checked; the api does not check `required` on submit; there is no other condition type yet
