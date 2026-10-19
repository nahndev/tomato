# Add template module for collab app

## Currently

- `apps/collab` (Hocuspocus + file storage) only has `collab` and `storage` modules; document handling is tied to the generic `CollabService`, which parses the template id from the document name and validates it itself.
- There is no `template` module in `collab`, so template-specific logic (document name parsing, template id validation, loading/saving template content) has no dedicated home.
- Goal: add a `template` module to `apps/collab` that owns template-document logic, following the same layering as the other NestJS apps (controller/gateway → service → repository), so `collab` stays a thin transport layer.

## Acceptance Criteria

- [x] collab nestjs add module /template
- [x] TemplateService convert yjsdoc into yjs
- [x] TemplateController export endpoint get current state

## Solutions

- [x] Add module and handle service, controller
- [x] Add publish api version, api get snapshot from collab server
- [x] Base on snapshot create TemplateVersion
