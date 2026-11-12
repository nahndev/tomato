# Add the `ReferSubmission` widget

## Currently

- Submissions can already be related: the `submission_dependencies` table ([schema.prisma](../../apps/api/prisma/schema.prisma), [add-submission-dependencies.md](./add-submission-dependencies.md)) stores directed edges `source → target`, where the source depends on the target. Each edge has a `type` (`SubmissionDependencyType`: `parent`, `reference` in [submission.constants.ts](../../packages/constants/src/submission.constants.ts)), an indexed `refer` string meant for lookups such as "which widget created this edge", an `idempotency_key` that is unique per source, and a `meta` json column.
- Edges are read-only. `SubmissionDependenciesController` ([submission-dependencies.controller.ts](../../apps/api/src/modules/submission-dependencies/submission-dependencies.controller.ts)) only serves `GET /submissions/:id/graph`. No endpoint creates or deletes a dependency ("Known gaps" in [board-submission.md](../../docs/board-submission.md)), so the only graphs that exist come from seeded or hand-inserted rows. Nothing in the api fills in `type`, `refer` or `idempotency_key` either, and nothing validates them.
- The web shows the graph as a tree in the submission sidebar: `SubmissionGraph` ([submission-graph.tsx](../../apps/web/src/modules/submission/components/submission-graph.tsx)), `Graph.toTree()` ([graph.ts](../../apps/web/src/modules/submission/utils/graph.ts)) and `useSubmissionGraph` ([add-submission-graph-component.md](./add-submission-graph-component.md)). The data layer has `getSubmission` and `getSubmissionGraph` in [submission.service.ts](../../apps/web/src/modules/submission/services/submission.service.ts), but no call that creates or removes a dependency.
- No widget points at another submission. `WidgetType` ([template-editor.constants.ts](../../packages/constants/src/template-editor.constants.ts)) has no submission type:
  - The data fields are text, number, date/time, select / checkbox / radio, signature, uploaders, `board` (a drawing canvas, unrelated to boards of submissions) and `users`. `users` is still a disabled placeholder ([users-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/users-widget-item.tsx)).
  - The `DEFAULT` group (`created-at`, `template`, `submitted-by`) renders `SystemFieldWidgetItem` ([system-field-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/system-field-widget-item.tsx)): read-only text that says the system sets the value.
  - Links between widgets exist only inside a template (`TemplateDocKey.LINKS`, `LinkTargetType.WIDGET`, used by `RepeatView`, see [add-repeat-view-widget.md](./add-repeat-view-widget.md)). No link reaches outside the template, such as to a board, another template or a submission.
  - A new widget type has to be added to every registry: `widget-registry.ts`, `widget-items.constants.ts`, `widget-settings.constants.ts`, `widget-layouts.constants.ts`, the board's `widget-value-types`, and the copilot context.
- Form values reach the api only through collab. The Yjs doc `submission/<id>` is pushed to `PUT /submissions/:id/values`, and `SubmissionsService.applyValues` ([submissions.service.ts](../../apps/api/src/modules/submissions/submissions.service.ts)) stores `data[widgetId]` and rebuilds `data_displays`. That path never touches `submission_dependencies`, so a value cannot create, change or remove an edge.
- The board's display types (`text`, `date`, `time`, `datetime`, `number`) have no kind for a submission reference, so a board column cannot show "the submission this one refers to".
- Submissions have no name column, and the graph nodes are `{ id }` only. The sidebar labels a submission with the last 8 characters of its uuid (`SUBMISSION_SHORT_ID_LENGTH`), so a picker of submissions would have nothing readable to show either.
- Choosing a submission needs a list to choose from. Today the only one is `GET /submissions?boardId=`: a single page of up to 100 submissions of one board, with no search and no filter by template.
- As a result, people who fill a form cannot say "this approval refers to that request" or "this delivery belongs to that order". They copy ids or names into text fields by hand, and those relations never show up in the dependency graph.

## Acceptance Criteria

- On template:
- [ ] `TemplateSnapshot` add new record `behaviors: {[widgetUuid]: [type]}` same with linkHandler (listen event `WidgetPropertyChangedEvent`)

- [ ] Add new component `ReferSubmission`, add widgetUuid to `behaviors`
- [ ] `ReferSubmission` allow choice a link widget save to `links` (using `LinkWidgetDescriptor`) as on delete case cade
- [ ] `ReferSubmission` display as list progressing steps with icon + description. On top is `start` button

- On submission:
- [ ] When click `start` button -> add value for click action
- [ ] When saving to backend `

## Solutions

- [ ]
- [ ]
- [ ]
