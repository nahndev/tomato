# Add dependencies between submissions

## Currently

- A submission is standalone: the `submissions` table ([schema.prisma](../../apps/api/prisma/schema.prisma)) only has `board_id`, `template_version_id`, `data`, `data_clocks`, `data_displays`; there is no column or table that relates one submission to another.
- A board links several templates (`board_templates`), and each submission is created from one of them (`POST /submissions` `{ boardId, templateId }`, newest published version frozen, see [board-submission.md](../../docs/board-submission.md)), so one board can already hold submissions of different templates side by side, but nothing ties them together.
- Values only arrive through collab: the Yjs doc `submission/<submissionId>` is pushed to `PUT /submissions/:id/values` ([submissions.service.ts](../../apps/api/src/modules/submissions/submissions.service.ts)); `applyValues` keeps only keys that are widgets of the submission's own version, so a submission cannot read or reference a value of another submission.
- On the web, `/system/boards/[id]` lists submissions as a flat table driven by the board columns ([board/components/submissions](../../apps/web/src/modules/board/components/submissions)), and `/submissions/[id]` ([submission-page.tsx](../../apps/web/src/modules/submission/components/submission-page.tsx)) renders one submission alone: there is no way to see which submissions it depends on or which depend on it.
- Deleting a submission (`DELETE /submissions/:id`) or a board (cascade) has no effect on other submissions.
- Real processes span several forms (e.g. a request → its approval → its follow-up report; one order → many delivery forms), so today users have to track the relation by hand (copying ids / names into text fields).

## Acceptance Criteria

- [x] Every submission can link to other submission with dependency `id`, `source`, `target`, `type`, `refer`, `key` as idempotency, `meta` as json
  - [x] id -> uuid v7
  - [x] source - FK to submission
  - [x] target - FK to submission
  - [x] type - constants - base on this will handle case-case, filter, ....
  - [x] refer - special string allow index for fast search (ex: which is created by widget?)
  - [x] key - idempotency key remove duplicate behaviors (should suggest new name)
  - [x] meta - more data
- [x] When get `submissions/:id` return response add the graph of submissions with dependence

## Scope

- Don't handle `how to create dependence?`, this ticket only handler base on dependence existed.
- `How to create dependence?` will handler in other

## Solutions

- [x] Model: table `submission_dependencies` (`SubmissionDependency`): `id` uuid v7, `source_id` / `target_id` FK to `submissions` (`onDelete: Cascade` on both, so deleting a submission or its board drops its edges), `type` (`SubmissionDependencyType` in `@tomato/constants`: `parent`, `reference`; a plain string column, no Prisma enum), `refer` (nullable, indexed), `idempotency_key` (the suggested name for `key`; nullable, `@@unique([sourceId, idempotencyKey])`, NULLs never collide), `meta` jsonb `{}`; index on `target_id` (`source_id` is covered by the unique index); `Submission.dependencies` / `Submission.dependents` back-relations
- [x] Migration `20261112014231_add_submission_dependencies`, plus a hand-written `CHECK (source_id <> target_id)` (Prisma cannot express it) so a submission cannot depend on itself
- [x] Module: api `modules/submission-dependencies` (no controller yet) owns the dependency types, `SUBMISSION_GRAPH_MAX_DEPTH`, `SubmissionDependenciesRepository` and `SubmissionDependenciesService` (exported, imported by `SubmissionsModule`); the create / delete endpoints of the next ticket go here
- [x] Graph: `SubmissionDependenciesService.getGraph(submissionId)` → `SubmissionDependenciesRepository.findGraph(submissionId, maxDepth)` runs a recursive CTE over the edges in both directions (two index-backed branches in a `LATERAL` union), deduped on `(id, depth)` and capped at `SUBMISSION_GRAPH_MAX_DEPTH` (10), so cycles stop and the work stays bounded; it then loads the nodes (`SUBMISSION_INCLUDE` / `SUBMISSION_OMIT`, the board-list shape) and the edges between them in one transaction
- [x] `GET /submissions/:id`: `SubmissionsService.get` reads the graph through `SubmissionDependenciesService` and returns `SubmissionDetailEntity = SubmissionRecordEntity & { graph: { nodes, edges } }`; `nodes` include the submission itself, a submission without edges gets `{ nodes: [itself], edges: [] }`
- [x] Web: `SubmissionDependency` / `SubmissionGraph` and `SubmissionDetail.graph` in `submission.types.ts`, no UI
- [x] Docs: `docs/board-submission.md` (model, dependency graph, known gaps)
- [x] Not covered: creating / deleting dependencies (another ticket), so `type` / `refer` / `idempotency_key` are not validated by any endpoint yet; no pagination of large graphs beyond the depth cap
