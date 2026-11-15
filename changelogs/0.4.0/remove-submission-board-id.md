# Remove the board id from a submission

## Currently

- A submission belongs to exactly one board: `Submission.boardId` (`board_id`, `@db.Uuid`, indexed) is a required relation to `Board` with `onDelete: Cascade` (`apps/api/prisma/schema.prisma`, migration `20261019000000_add_boards_and_submissions`), so deleting a board deletes its submissions (`DELETE /boards/:id`).
- A submission's template is already reached without the board, through its frozen version (`templateVersionId` → `TemplateVersion.templateId`); the board only links templates (`board_templates`).
- Create: `POST /submissions` takes `{ boardId, templateId }` (`CreateSubmissionDto`); `SubmissionsService.create` checks the template is linked to the board (`findLinkedTemplate(boardId, templateId)`) and published, then stores `boardId` on the row.
- List: `GET /submissions?boardId=` (`ListSubmissionsQueryDto`, `boardId` required) filters `where: { boardId }` in `SubmissionsRepository.findMany`; it is the only way to list submissions.
- Behaviors: `ApplyChangesContext` carries the `boardId` of the entity (`getBoardId()` throws when missing); `refer-submission` (`SubmissionBehaviorsService`) uses it to create the target submissions **on the same board** (`ReferTarget { boardId, templateVersionId }`, `SubmissionDependenciesRepository`) and to check `linkTemplateUuid` is linked to that board.
- Realtime: `SUBMISSION_SELECT` returns `boardId`; `UpdatedSubmissionEntity` includes it and `SubmissionsRealtimeListener` emits `submission.values` to the room `board:<boardId>`.
- Web (`modules/board`): `Submission.boardId` and `SubmissionValues` (`board.types.ts`); `listBoardSubmissions(boardId)` / `createSubmission(boardId, templateId)` (`board-submissions.service.ts`); `useBoardSubmissions` joins `board:<boardId>` and drops realtime values whose `boardId` differs; query key `boardKeys.submissions(boardId)`.
- Docs: `docs/board-submission.md` describes `submissions.board_id`, the `?boardId=` list, the `{ boardId, templateId }` create body and the `board:<boardId>` room.

## Acceptance Criteria

- [x] The `Submission` break link to `boardId`
- [x] The `BoardSubmissionPage` show list submission base on `template` instead of `board-id`
- [ ]

## Solutions

- [x] Prisma: `Submission.boardId` and `Board.submissions` removed; migration `remove_submission_board_id` drops `submissions.board_id`, its index and foreign key, so deleting a board keeps its submissions
- [x] API `submissions`: `GET /submissions?templateIds=<uuid>,<uuid>` (`SUBMISSION_TEMPLATE_IDS_SEPARATOR`, at least one id) lists the submissions of any version of those templates; `POST /submissions` takes `{ templateId }` and uses its newest published version (`findLatestVersionTemplate`: `400` unknown, `409` unpublished); `ApplyChangesContext` has no board id
- [x] `refer-submission` creates its targets from the newest published version of `linkTemplateUuid` without a board check (`createReferDependencies(..., templateVersionId)`, `ReferTarget` removed)
- [x] Realtime: `RealtimeRoom.BOARD` → `RealtimeRoom.TEMPLATE`; `submission.values` goes to `template:<templateId>` with `templateVersion.templateId` instead of `boardId`
- [x] Web `board`: `useBoardSubmissions(board)` lists by the linked template ids (query key `boardKeys.submissions(boardId, templateIds)`, disabled without templates), joins one `template:<id>` room per template and merges values of those templates; `createSubmission(templateId)`; `Submission.boardId` removed; the board delete dialog says the submissions are kept
