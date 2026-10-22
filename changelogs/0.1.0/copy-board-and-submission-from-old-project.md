# Copy board and submission features from the old project

## Currently

- The new project (`tomato`) only has templates (list, categories, realtime editor, publish a version). It has no board and no submission feature.
- The old project (`/home/dev/sources/tomato-form2`) already has both:
  - **Board**: groups the submissions of one or more templates and lets users track them. Has configurable columns (widget value + display type), views (e.g. table/chart), search and filtering, header actions, discussion and history tabs, and a settings screen.
    - Server: `server/src/board` (controller, service, DTOs for board / column / view)
    - Web: `website/src/features/board`, `website/src/app/system/boards`
    - DB migrations: `add_boards`, `board_template_versions`, `add_board_views`
  - **Submission**: a filled-in instance of a published template version, edited by several users in realtime and shown inside a board.
    - Server: `server/src/submission` (controller, service, value events, DTOs)
    - Web: `website/src/features/submission` (canvas, sessions, widgets, header, connection), `website/src/app/submission/[uuid]`
    - Realtime documents: `yjs-server/public/submission/<uuid>`
    - DB migrations: `add_submission_data_clocks`, `add_submission_data_displays`
- Board and submission depend on published template versions (`template_versions`), which the new project now supports (`POST /templates/:templateId/versions`).
- Goal: port the board and submission features into the new project, following the new conventions (`CONTRIBUTING.md`, class-validator DTOs, `@tomato/*` shared packages, shadcn/ui, realtime through `apps/collab`), instead of copying the old code as is.
- Reference: `docs/WIDGET.md` in the old project (board column rendering and submission widget items).

## Acceptance Criteria

- [x] Copy old feature from old project with changes
- [x] Board base on `TemplateVersion` instead of `Template`
- [x] Submission base on `TemplateVersion` base on `Template`
- [x] Board: Only for board display columns
- [x] Submission: full feature

## Solutions

- [x] Handle base on ticket
- [x]
- [x]
