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
- [ ] When data saved, in route `submissions/:id/values`, before `applyValues` add function `applyBehaviors`
- [ ] `applyBehaviors` load all `behaviors` loop all behaviors with changes -> `ReferSubmission` will base on value of `linkWidget` get all `users` -> for every `user`, then create a`submission` and a `dependence`

## Solutions

- [x] Model: `WidgetType.REFER_SUBMISSION` (`refer-submission`), full width, group `ADVANCE`; `LinkTargetType.TEMPLATE`, `LinkDeleteAction.NONE`, `TemplateDocKey.BEHAVIORS` and `WidgetBehaviorType` (`refer-submission`) in `@tomato/constants`; new property `linkTemplateUuid`
- [x] Links: `type` moved out of `LinkTarget` to the key it already was (`links[widgetId] = { [type]: { uuid, onDelete } }`), so `LinkHandler.setLink(widgetId, type, target)`; a refer submission mirrors `linkWidgetUuid` as a `widget` + `cascade` link (removing the users widget removes it) and `linkTemplateUuid` as a `template` + `none` link
- [x] Behaviors: `TemplateSnapshot.behaviors: { [widgetUuid]: WidgetBehaviorType[] }` (web / api / collab types, collab `toTemplateSnapshot`, web `TemplateState`), migration `20261112150000_backfill_template_snapshot_behaviors`; `BehaviorHandler` sets them from `WIDGET_BEHAVIORS` on `WidgetAddedEvent` (`addWidget` emits no `WidgetPropertyChangedEvent`) and drops them on `WidgetRemovedEvent`
- [x] Editor: `LinkWidgetDescriptor` picks from `LINK_WIDGET_CHOICES[widgetType]` (repeat view: `REPEAT_LINK_WIDGET_TYPES`, refer submission: `users`); `LinkTemplateDescriptor` picks the template from `useTemplates()`; copilot gets `linkTemplateUuid` and `linkedTemplateId`
- [x] UI: `ReferSubmissionWidgetItem` shows a `Start` button over one step per user (icon + description: waiting / creating / created with a link to the submission); `FormReferSubmissionWidgetItem` builds the steps from the linked users value and `TemplateForm`'s `references`, which `SubmissionForm` derives from the graph edges (widget id from `refer`, user id from `idempotencyKey`, both split on `SUBMISSION_REFER_SEPARATOR`) and polls while a started step is pending
- [x] Start writes the click time as the widget value, so every click is a new clock
- [x] Api: `SubmissionsService.applyChanges` merges the pushed values into an `ApplyChangesContext` (`SubmissionValuesService.applyValues`), runs `SubmissionBehaviorsService.applyBehaviors` on it, then stores the values and rebuilds `data_displays`
- [x] `refer-submission` syncs its edges with the ids of `linkWidgetUuid` (merged value; not an array → `400 VALIDATION_FAILED`): `refer` = `<sourceId>:<widgetId>`, `idempotency_key` = `<refer>:<id>`; `SubmissionDependenciesService.deleteReferencedExcept` deletes the target submissions of deselected ids (their edges cascade), then `createReferDependencies` creates, for each new id, an empty submission (board + newest published version of `linkTemplateUuid`, no data) with its `reference` edge in one nested write (a concurrent duplicate hits the unique key and is skipped); a template not linked to the board is logged and skipped, since a throw would block every value push
- [x] Deleting a submission also deletes the submissions it refers to (`SubmissionsRepository.delete`); deleting a target removes its edges through the `target_id` cascade
- [x] Not covered: the `users` widget is still a placeholder (values must be set another way) and steps show a shortened user id, not a name; only top-level widgets (scoped keys are not stored by `applyValues`); ids are not checked against users; created submissions keep an empty `data_displays` until their first value push; deleting a submission removes only one level of referenced submissions; polling stops only when every step is created, so a misconfigured template keeps it polling
