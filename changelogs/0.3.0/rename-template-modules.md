# Rename files and symbols of the template modules

## Currently

- `template`, `template-editor`, `template-form`, `template-store` have file and symbol names that do not show what they hold or which module they belong to:
  - Same word, two meanings across modules: `SessionCanvas` (a grid) vs the canvas widget, `TemplatePreview` (details panel) vs the editor's preview mode, `TemplateView` (grid/list) vs `TemplateMode.VIEW`, the editor's `WidgetItem` vs the `*WidgetItem` of `template-widget`, `FormField` vs shadcn `FormField`
  - Files whose name covers one of their exports: `form-container.tsx` (form state, container grid, three container items, field), `template-provider.tsx` (editor provider, widget selection, meta hooks), `template-builder-provider.tsx` (only the mode)
  - `template-store` is a read-only context, not a store; contexts are declared in `hooks/` or in provider files with no rule; `state` / `live state` / `snapshot` name the same `TemplateSnapshot`
  - `*-descriptor.tsx` are property fields, `sync/copilot/` is not sync, `copilot-template-context.ts` vs `template-copilot-context.tsx`
  - Constants outside `<module>.constants.ts` (`ToolbarType`, `ToolbarMode`, `property.constants.ts`) and route constants (`getTemplatePath`, `TEMPLATES_PATH`)
  - `getTemplate` and its query key live in `template-editor` while every other template request is in `template`
  - The api module `template-editor` only serves `templates/:templateId/versions`; its siblings are named after their resource (`templates`, `template-categories`)
  - Leftovers: unused `useTemplateActions`, rich text helpers and `describeWidget` inside `widget-properties-input`, `useSessionState` next to `useTemplateSnapshot`, `WidgetPropertyFieldProps` next to `PropertyField*`, zod schemas without the `Schema` suffix

## Acceptance Criteria

- [x] Every file and exported symbol of the four modules says what it holds, without clashing with another module
- [x] Constants follow CONTRIBUTING (module constants file, no route constants)
- [x] Behaviour of the editor, copilot, template list and submission form is unchanged

## Solutions

- [x] `template-store` → `template-data`: `TemplateDataProvider` / `TemplateDataValue`, `useWidgetById` → `useWidget`, `useScopedValue` spec split (shared `testing/render-in-scope`)
- [x] `template-form`: `form-container` split into `template-form-provider` (`TemplateFormState`, `useTemplateForm`), `form-session-grid`, `widget/form-*-widget-item` (`FormWidgetItem`); `FormSession` → `FormSessionBox` reusing `FormSessionGrid`
- [x] `template-editor` providers: one provider per file, context next to its provider (`TemplateEditorProvider`, `TemplateSnapshotProvider` + `useTemplateSnapshot`, `TemplateMetaProvider`, `TemplateModeProvider`, `WidgetSelectionProvider`, `SessionIdProvider`); `readTemplateSnapshot`, `useTopLevelSessions`
- [x] `template-editor` components: `layout/` (`EditorHeader`, `EditorWorkspace`, `ConnectionStatus`), `SessionGrid`, `SessionList`, `AddSessionButton`, `EditorWidgetItem`; toolbars `WidgetToolbar`, `StructureToolbar`, `PropertyToolbar`, `VersionToolbar`, `ChatToolbar`; `toolbar/property/fields/*-field` + `PROPERTY_FIELD_REGISTRY`, `fields/button-actions/` (`BUTTON_ACTION_REGISTRY`)
- [x] `copilot/` at the module root: `components/` (`CopilotAgentContext`, `*CopilotTools`), `utils/` (`describe-template`, `*-input` with `*InputSchema`, `toRichTextState`); `createTemplateSyncDoc`, `utils/container-widget`
- [x] `ToolbarType`, `ToolbarMode`, `PropertyKey`, `WIDGET_PROPERTY_KEYS`, `LINK_WIDGET_CHOICES` in `template-editor.constants.ts`
- [x] `template`: `TemplateDetails`, `TemplateSearch`, `TemplateLayout` / `TemplateLayoutToggle`, `CreateTemplateDialog`, `library/` (`TemplateLibrary`); `useTemplate` moved here from the editor; route constants removed
- [x] Api `template-editor` → `template-versions` (`TemplateVersionsController` / `Service` / `Repository` / `Module`, `template-versions.types.ts`)
- [x] Web leftovers: remove `useTemplateActions`; `copilot/utils/rich-text.ts`, `describeWidget` in `describe-template.ts` (uses `sortOptions`); `useSessionSnapshot`; `PropertyFieldProps`; `*Schema` suffix on every copilot zod schema; `session-id-provider` in `components/provider/`; `TemplateMetaProvider` takes only `templateId` / `version`; named export of `TemplateBrowser`
- [x] `docs/template-editor.md`, `docs/templates.md` updated
