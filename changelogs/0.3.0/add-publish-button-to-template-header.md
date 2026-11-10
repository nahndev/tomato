# Add a publish new version button to the template header

## Currently

- Publishing a new version is only possible from the "Versions" toolbar panel: `PublishButton` ([publish-button.tsx](../../apps/web/src/modules/template-editor/components/toolbar/version/publish-button.tsx)) inside `VersionSetting` ([version-setting.tsx](../../apps/web/src/modules/template-editor/components/toolbar/version/version-setting.tsx)), registered as `ToolbarType.VERSION` in [toolbar-registry.ts](../../apps/web/src/modules/template-editor/components/toolbar/toolbar-registry.ts). The user has to open that panel first, so the main action after editing a template is hidden.
- `TemplateHeader` ([template-header.tsx](../../apps/web/src/modules/template-editor/components/template/template-header.tsx)) shows the current version (`v{version}` or "Not published"), the connection status and the Edit/Preview switch, but no publish action.
- The backend and the web hook already exist: `POST templates/:templateId/versions` publishes the current draft as the next version (`TemplateEditorService.publish`), and `usePublishTemplate` ([use-publish-template.ts](../../apps/web/src/modules/template-editor/hooks/use-publish-template.ts)) calls it and refreshes the versions query.
- Goal: add a "Publish" button to the template header so a new version can be published straight from the editor, and keep the version shown in the header up to date after publishing.

## Acceptance Criteria

- [x] Header of template, add publish button
- [x] It same with `publish` button on toolbar

## Solutions

- [x] Reuse `PublishButton` in `TemplateHeader`, between the connection status and the Edit/Preview switch; it shows in both modes, like the "Versions" panel (not edit-only)
- [x] No new state: `usePublishTemplate` invalidates `templateEditorKeys.versions`, which `TemplateEditor` reads (`useTemplateVersions`) to pass the header version, so `v{version}` updates after publishing
