# Split template-editor into 3 modules

## Currently

- `apps/web/src/modules/template-editor` has grown to ~147 files and holds three different concerns in one module:
  - **Builder**: the realtime editor (`TemplateEditor`). Includes `sync/` (sync doc, handlers, actions hooks), `sync/copilot/`, `components/toolbar`, `components/property` (+ descriptors, api-call editor), `components/lexical`, `components/canvas`, `components/template`, `components/provider`, session editing (`session-creation`, `session-setting-popup`, …), versions/publish (`use-template-versions`, `use-publish-template`), `stores/use-toolbar-mode-store`
  - **Form**: the read-only/fill-in renderer (`TemplateForm` in `components/form/`). Used by `modules/submission` (`submission-form.tsx`)
  - **Widgets (shared)**: the widget registry and the 20 `components/widget/items/*`, `widget-items` / `widget-layouts` / `widget-settings` constants, `EditorIcon`, `TemplateMode`, and the pure utils (`session-condition`, `datetime`, `options`, `template-mode`) that both the builder and the form need
- The module is used from outside through `index.ts` by:
  - `app/templates/[id]/page.tsx`: `TemplateEditor`, `resolveTemplateMode`
  - `modules/submission`: `TemplateForm`
  - `modules/board` (`add-template.tsx`): `useTemplateVersions`
- Problems:
  - `TemplateForm` only renders a snapshot, but it lives next to the sync/copilot code, and the shared widget code depends on builder internals: `widget-item.tsx` imports `useWidgetActions` (sync) and `template-builder-provider`; `session-widget-item` and `file-uploader-widget-item` reach into sync as well. The form cannot be changed or tested without the builder
  - Hard to see what is public: `index.ts` mixes builder, form and versioning exports
  - CONTRIBUTING forbids importing internal files of another web module, so a split must go through `index.ts` and the dependencies must point one way
- Goal: split into 3 web modules with a one-way dependency (`template-editor` → `template-widget` ← `template-form`):
  - `template-widget`: widget registry + items (render only, no sync), widget constants, `EditorIcon`, shared types and pure utils
  - `template-editor`: builder only (sync, copilot, toolbar, property, lexical, canvas, versions/publish)
  - `template-form`: `TemplateForm` and form session rendering, used by `submission`
- Names are a proposal; behaviour of the editor, copilot and submission form must not change. The api module `apps/api/src/modules/template-editor` is out of scope

## Acceptance Criteria

- [x] Module `template-editor` for edit template, include toolbar, settings, drag, drop, ....
- [x] Module `template-widget` for widget display, using multiple places
- [x] Model `template-form` for display template in submission, only display and edit value

## Solutions

- [x] `template-widget` (new): widget registry + `items/`, and what the items render with: `lexical/` (label), `canvas/` (board), `actions/button-action-context` + `use-run-button-action` (button); `constants/widget-*.constants.ts`; `template-editor.icons.ts` → `template-widget.icons.ts` + `EditorIcon`; `utils/options`, `utils/datetime`. No import of sync or builder providers
- [x] `template-widget.types.ts` takes the widget types (`FieldComponentProps`, `WidgetItemDefinition`, `WidgetComponent*`); `template-widget.constants.ts` takes `ColorEnum`. `template-editor.types.ts` keeps `TemplateState` and the property descriptor types
- [x] New `WidgetView` (label + field, optional `value` / `onChange`) replaces the editor's `WidgetPreview` and the form's `FormWidget` (removed); the editor's `WidgetItem` = `WidgetBox` (selection, remove) around `WidgetView`
- [x] `template-form` (new): `TemplateForm`, `FormSession`, `utils/session-condition`; `submission` imports `TemplateForm` from `@/modules/template-form`
- [x] `template-editor` keeps the builder (sync, copilot, toolbar, property + action setup, provider, session, versions/publish) and imports widgets through `@/modules/template-widget`; its `index.ts` drops `TemplateForm`, `EditorIcon`, `WidgetItems`
- [x] Dependencies one way: `template-editor` → `template-widget` ← `template-form`; `docs/template-editor.md`, `docs/board-submission.md` updated
