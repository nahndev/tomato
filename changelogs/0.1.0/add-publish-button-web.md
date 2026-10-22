# Add publish button to the web template editor

## Currently

- The API already exposes `POST` on the template versions route (`TemplateEditorController.publish`), which publishes the current draft as a new `TemplateVersion`.
- The web editor has no way to trigger it: `TemplateHeader` only shows the current version label (`vX` / "Not published"), the connection status and the Edit/Preview switch.
- Goal: add a Publish button to the template editor header (edit mode) that calls the publish API via `services/` and reflects the new version in the UI.

## Acceptance Criteria

- [x] Publish button shown in the Versions panel
- [x] Click calls the publish API and shows a success/error toast
- [x] Button is disabled while publishing; the version label updates after success

## Solutions

- [x] `publishTemplate` in `template-editor.service.ts` (`POST /templates/:id/versions`)
- [x] `usePublishTemplate` mutation hook, invalidates `templateEditorKeys.versions`
- [x] `PublishButton` component added to the `VersionSetting` toolbar panel
