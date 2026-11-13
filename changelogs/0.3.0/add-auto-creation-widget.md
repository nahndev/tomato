# Add the `AutoCreation` widget

## Currently

- Widgets are listed in `WidgetType` ([template-editor.constants.ts](../../packages/constants/src/template-editor.constants.ts)) and registered in the widget registries (`widget-registry.ts`, `widget-items.constants.ts`, `widget-settings.constants.ts`, `widget-layouts.constants.ts`, board `widget-value-types.constants.ts`) of [template-widget](../../apps/web/src/modules/template-widget); there is no widget that acts on other submissions: every widget only reads / writes a value of its own submission (or of a scope inside it, see [add-mixed-view-widget.md](./add-mixed-view-widget.md) / [add-repeat-view-widget.md](./add-repeat-view-widget.md)).
- Submissions can depend on each other ([add-submission-dependencies.md](./add-submission-dependencies.md)): table `submission_dependencies` with `source_id`, `target_id`, `type` (`SubmissionDependencyType`: `parent`, `reference` in [submission.constants.ts](../../packages/constants/src/submission.constants.ts)), `refer` (indexed, meant for "which widget created it?"), `idempotency_key` (`@@unique([sourceId, idempotencyKey])`) and `meta`.
- Dependencies can only be read, never created from the app: `SubmissionDependenciesController` ([submission-dependencies.controller.ts](../../apps/api/src/modules/submission-dependencies/submission-dependencies.controller.ts)) only has `GET /submissions/:id/graph`, and `SubmissionDependenciesService` only `getGraph`. That ticket left "How to create dependence?" to another one, so graphs only exist from seeded or hand-inserted rows.
- A submission is only created by hand: `POST /submissions` `{ boardId, templateId }` (`SubmissionsService.create` in [submissions.service.ts](../../apps/api/src/modules/submissions/submissions.service.ts)) takes the newest published version of a template linked to the board, starts with empty data and never links the new submission to another one.
- Values only arrive through collab (`PUT /submissions/:id/values` → `applyValues`), which keeps only keys that are widgets of the submission's own version, so filling a form has no server-side effect beyond its own data.
- The only widget that runs actions is `button` ([button-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/button-widget-item.tsx)), and its actions (`ButtonActionType`: `link`, `mail`) run in the browser and touch no submission.
- The dependency tree in the submissions sidebar ([add-submission-graph-component.md](./add-submission-graph-component.md)) can already show related submissions and navigate between them, but real processes (a request → its approval → its follow-up report; one order → many delivery forms) still need users to create each related submission by hand from the board and track the relation themselves.

## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Solutions

- [ ]
- [ ]
- [ ]
