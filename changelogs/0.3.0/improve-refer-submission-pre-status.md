# Improve `ReferSubmission` with a pre-status before run

## Currently

- `ReferSubmission` ([add-refer-submission-widget.md](./add-refer-submission-widget.md)) shows a `Start` button over one step per user of its linked `users` widget ([refer-submission-widget-item.tsx](../../apps/web/src/modules/template-widget/components/items/refer-submission-widget-item.tsx)). `FormReferSubmissionWidgetItem` ([form-container.tsx](../../apps/web/src/modules/template-form/components/form-container.tsx)) builds the steps from the **current** users value (`getReferUserIds` in [refer-submission.ts](../../apps/web/src/modules/template-form/utils/refer-submission.ts)) and the `references` that `SubmissionForm` ([submission-form.tsx](../../apps/web/src/modules/submission/components/submission-form.tsx)) reads from the graph edges (`userId → submission path`).
- A step's status depends on only two things: whether it has a reference (`href`), and whether the widget has ever been started (`isStarted = Boolean(value)`, the time of the last click):
  - with `href` → "Submission created" (with a link)
  - no `href`, never started → "Waiting to start"
  - no `href`, started → spinner "Creating submission…"
- The run happens only on the api, and only when the widget's own value changes: `SubmissionBehaviorsService.applyBehaviors` ([submission-behaviors.service.ts](../../apps/api/src/modules/submissions/submission-behaviors.service.ts)) skips a behavior unless `changes.has(widget.id)`. Editing the users widget afterwards does nothing on the server until `Start` is clicked again. When it is clicked, `referSubmissions` syncs the edges with the users value: `deleteReferencedExcept` deletes the submissions of users that were removed, and `createReferDependencies` creates a submission for each new user.
- So after the first run, the steps no longer show what the next run will do:
  - **A user added after a run** shows "Creating submission…" with a spinner, although nothing is running and nothing will happen until `Start` is clicked again. `SubmissionForm.isPending` treats the same state as pending, so it polls `GET /submissions/:id/graph` every `REFER_SUBMISSION_POLL_MS` (2s) indefinitely.
  - **A user removed after a run** disappears from the list, while their submission and edge still exist. Nothing warns that the next `Start` will **delete** that submission.
  - **Users that did not change** look the same as before, so there is no way to tell what has already run from what is about to run.
- `Start` is enabled whenever there is at least one step. It stays enabled when the next run would change nothing (every user already has a submission), and when it would only delete (the users value is now empty, `steps.length === 0` disables it, so the deletions cannot be applied at all).
- A run that does nothing has no status of its own. When `linkTemplateUuid` is not linked to the board or has no published version, the api only logs a warning, so the steps stay on "Creating submission…" and polling never stops ("Not covered" in the previous ticket).
- Steps are labelled `User <last 8 chars of id>` (`USER_SHORT_ID_LENGTH`), so the person clicking `Start` cannot easily check who will get a submission.

## Acceptance Criteria

- [ ] When open `refer-submission` load all dependence by `refer`
- [ ] Base on value of widget -> make idempotency-keys
- [ ] If key exist + submission exist -> show created
- [ ] If key exist + submission don't exist -> show will create
- [ ] If key don't exist + submission exist -> show will delete
- [ ] If exist change (will create or will delete), button start active
- [ ] Change button `start` into `apply` button

## Solutions

- [x] Dependencies by refer: no new endpoint. `GET /submissions/:id/graph` already returns every edge whose source is the submission, and `SubmissionForm` maps those with `refer` `<sourceId>:<widgetId>` to `references[widgetId][userId]` (user id taken from the idempotency key). An edge exists only while its target does (`target_id` cascade), so "key exists" means "submission exists".
- [x] Pre-status: `ReferStepStatus` (`created`, `will-create`, `will-delete`) in `template-widget`; `getReferSteps(userIds, references)` in `template-form` lists the selected users (`created` with a reference, otherwise `will-create`), then the referenced users that are no longer selected (`will-delete`, linked to the submission that would be deleted). `getReferUserIds` drops duplicate ids
- [x] `ReferSubmissionWidgetItem`: one icon + description per status, and the `Start` button becomes `Apply`, enabled only when a step is `will-create` / `will-delete` (so removing every user can now be applied and deletes all referenced submissions)
- [x] Running state: `useIsReferApplying(appliedAt)` is true for `REFER_SUBMISSION_APPLY_TIMEOUT_MS` (30s) after the click time stored as the widget value. The widget uses it only while it has changes (pending steps spin, `Apply` is disabled), and `SubmissionForm` polls the graph only while `getPendingReferAppliedAt` is recent. A user added long after the last apply now shows `will-create` instead of a spinner, and a skipped run stops polling after the timeout
- [x] Tests: `refer-submission.spec.ts` (steps, pending apply time), `template-form.test.tsx` (statuses, links, `Apply` enabled / disabled / running / stale), api spec for applying an empty selection
- [x] Not covered: steps still show a shortened user id, not the user's name; for up to 30s after an apply, a change made in the meantime also shows as running
