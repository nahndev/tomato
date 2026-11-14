# Make a widget registry for `template-editor` and `template-form`

## Currently

- `template-widget` owns the only widget registry: `WidgetComponents` in [widget-registry.ts](../../apps/web/src/modules/template-widget/components/widget-registry.ts) maps every `WidgetType` to one `*WidgetItem` component. `WidgetComponent` in [widget-view.tsx](../../apps/web/src/modules/template-widget/components/widget-view.tsx) renders from it.
- Both modules render widgets through that shared registry:
  - `template-editor`: `EditorWidgetItem` ([editor-widget-item.tsx](../../apps/web/src/modules/template-editor/components/widget/editor-widget-item.tsx)) calls `<WidgetComponent widget={widget} />` without `value`/`onChange`, inside an `inert` selection frame.
  - `template-form`: `FormWidgetItem` ([form-widget-item.tsx](../../apps/web/src/modules/template-form/components/widget/form-widget-item.tsx)) calls `<WidgetComponent widget value onChange />` under the data scope.
- One component per widget type has to work in both places. The only signal for "editor vs form" is whether `onChange` is passed (`FieldComponentProps.onChange?` in [template-widget.types.ts](../../apps/web/src/modules/template-widget/template-widget.types.ts)), so widgets branch on it inside `template-widget`, e.g. `onChange?.(...)` everywhere, `disabled={!onChange || ...}` in `ReferSubmissionWidgetItem`, `onChange ? <CommitOnBlur /> : null` in `TextEditor`.
- The form is where widgets have real behavior (button actions through `ButtonActionProvider`/`useRunButtonAction`, uploads, refer submission apply, signature/canvas drawing, repeat/mixed view data scopes). The editor only needs a preview. That runtime logic still lives in `template-widget` and ships to the editor as well.
- When a widget needs a different version per module, each module special-cases it with an `if` chain before falling back to the shared registry:
  - `EditorWidgetContent`: `CANVAS` → `EditorCanvasWidgetItem`, `MIXED_VIEW` → `EditorMixedViewWidgetItem`, `REPEAT_VIEW` → `EditorRepeatViewWidgetItem`.
  - `FormWidgetContent`: `CANVAS` → `FormCanvasWidgetItem`, `MIXED_VIEW` → `FormMixedViewWidgetItem` (with `isAllMounted` + `DataScopeProvider`), `REPEAT_VIEW` → `FormRepeatViewWidgetItem`.
  - So each new widget with module-specific behavior means another `if` in each module, plus extra props/flags (`isAllMounted`, `children` render props) on the shared core component.

## Acceptance Criteria

- [x] Make multiple registry
- [x] Update code base on new strategy
- [x] Refactoring old widget to cleanup them

## Solutions

- [x] `template-widget` keeps `WidgetComponents` as the core registry and exports it with `WidgetComponentRegistry` / `FieldComponent`; the shared `WidgetComponent` renderer is removed
- [x] `EditorWidgetComponents` (`template-editor/components/widget/editor-widget-registry.ts`) and `FormWidgetComponents` (`template-form/components/widget/form-widget-registry.ts`) spread the core registry and override `CANVAS`, `MIXED_VIEW`, `REPEAT_VIEW`; a type can also map to a host-only component
- [x] `EditorWidgetItem` / `FormWidgetItem` render `registry[widget.type]`; the `if` chains (`EditorWidgetContent`, `FormWidgetContent`) are removed
- [x] `template-widget` cleaned: explaining comments removed from the widget items, hooks, utils, lexical and types; late `Typography` imports moved to the import block (canvas, checkbox, label, radio, session, system field); `FieldComponentProps<unknown>` → `FieldComponentProps`
