# Add dependencies between submissions

## Currently

- A submission is standalone: the `submissions` table ([schema.prisma](../../apps/api/prisma/schema.prisma)) only has `board_id`, `template_version_id`, `data`, `data_clocks`, `data_displays`; there is no column or table that relates one submission to another.
- A board links several templates (`board_templates`), and each submission is created from one of them (`POST /submissions` `{ boardId, templateId }`, newest published version frozen, see [board-submission.md](../../docs/board-submission.md)), so one board can already hold submissions of different templates side by side, but nothing ties them together.
- Values only arrive through collab: the Yjs doc `submission/<submissionId>` is pushed to `PUT /submissions/:id/values` ([submissions.service.ts](../../apps/api/src/modules/submissions/submissions.service.ts)); `applyValues` keeps only keys that are widgets of the submission's own version, so a submission cannot read or reference a value of another submission.
- On the web, `/system/boards/[id]` lists submissions as a flat table driven by the board columns ([board/components/submissions](../../apps/web/src/modules/board/components/submissions)), and `/submissions/[id]` ([submission-page.tsx](../../apps/web/src/modules/submission/components/submission-page.tsx)) renders one submission alone: there is no way to see which submissions it depends on or which depend on it.
- Deleting a submission (`DELETE /submissions/:id`) or a board (cascade) has no effect on other submissions.
- Real processes span several forms (e.g. a request → its approval → its follow-up report; one order → many delivery forms), so today users have to track the relation by hand (copying ids / names into text fields).

## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Scope

- Don't handle `how to create dependence?`, this ticket only handler base on dependence existed.
- `How to create dependence?` will handler in other

## Solutions

- [ ]
- [ ]
- [ ]
