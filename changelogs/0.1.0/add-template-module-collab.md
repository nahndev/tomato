# Add template module for collab app

## Currently

- `apps/collab` (Hocuspocus + file storage) only has `collab` and `storage` modules; document handling is tied to the generic `CollabService`, which parses the template id from the document name and validates it itself.
- There is no `template` module in `collab`, so template-specific logic (document name parsing, template id validation, loading/saving template content) has no dedicated home.

## Acceptance Criteria

- [x] collab nestjs add module /template
- [x] TemplateService convert yjsdoc into yjs
- [x] TemplateController export endpoint get current state

## Solutions

- [x] Add module and handle service, controller
- [x] Add publish api version, api get snapshot from collab server
- [x] Base on snapshot create TemplateVersion
