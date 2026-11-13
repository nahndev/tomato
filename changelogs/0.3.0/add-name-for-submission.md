# Add name for submission

## Currently

- `Submission` ([schema.prisma](../../apps/api/prisma/schema.prisma)) has no name/title column: only `boardId`, `templateVersionId`, `data`, `dataClocks`, `dataDisplays` and timestamps. The web `Submission` type ([board.types.ts](../../apps/web/src/modules/board/board.types.ts)) mirrors that.
- A submission is created without any input from the user besides the template: `CreateSubmissionDto` ([create-submission.dto.ts](../../apps/api/src/modules/submissions/dto/create-submission.dto.ts)) only takes `boardId` + `templateId`, and `SubmissionsService.create` ([submissions.service.ts](../../apps/api/src/modules/submissions/submissions.service.ts)) is the single creation path (`POST submissions`, called from `useBoardSubmissions` in the board).
- Nothing in the UI identifies a submission by a human-readable label:
  - Board table `SubmissionTable` ([submission-table.tsx](../../apps/web/src/modules/board/components/submissions/submission-table.tsx)): rows only show the board's configured columns (`formatCell` over `dataDisplays`); the link to the submission is the first column's cell, which is just `—` (`EMPTY_CELL`) when that column has no item for the submission's template.
  - Submission page `SubmissionHeader` ([submission-header.tsx](../../apps/web/src/modules/submission/components/submission-header.tsx)): the title is the template name (`templateVersion.snapshot.name`), so every submission of the same template shows the same title.
  - Dependency tree `SubmissionGraph` ([submission-graph.tsx](../../apps/web/src/modules/submission/components/submission-graph.tsx)): each node shows the last `SUBMISSION_SHORT_ID_LENGTH` (8) characters of the id in monospace, the full id in the tooltip.

## Acceptance Criteria

- [x] Add new map `meta` for submission
- [x] The Map `meta` include `title`, `updated`, ...
- [x] Submission form change header into title editor
- [x] When mapping value of submission add `applyMeta`

## Solutions

- [x] `@tomato/constants`: `SubmissionDocKey.META` + `SubmissionDocMetaKey` (`title`, `updated`)
- [x] Web: `useSubmissionTitle` reads/writes `meta.title`; every value or title change also writes `meta.updated = Date.now()` in the same transaction. `SubmissionHeader` swaps the template name for `SubmissionTitleInput` (placeholder = template name, commit on blur / Enter)
- [x] Collab: `extractEntries(doc, key)` reads both maps with their Yjs clocks; `PUT /submissions/:id/values` sends `{ values, meta }`, skipped only when both are empty
- [x] Api: `submissions` gets a `title` column (required, default `''`) + `meta_clocks` (jsonb); `meta.updated` stays in the Yjs doc only. `ValueChanges(entity, values)` / `MetaChanges(entity, meta)` share one base that compares the clocks; `SubmissionMetaService.applyMeta` stores a string `title` whose clock changed
- [x] Title shown elsewhere: board table gets a leading "Title" column holding the row link (fallback: template name, then "Untitled"); `GET /submissions/:id/graph` nodes carry `title`, shown in the dependency tree instead of the short id
