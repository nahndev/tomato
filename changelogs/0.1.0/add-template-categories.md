# Add template categories

## Currently

- Templates have no category; `Template` only has `name`, `description`, `previewImageUrl` and timestamps.
- The template browser (`/workspace/templates`) can only filter by name, so users cannot narrow down or group templates by purpose.
- Goal: let a template belong to a category, and let users browse/filter templates by category.

## Acceptance Criteria

- [x] On right of template browser, add categories
- [x] Categories is list with group pin, categories
- [x] Update layout to <categories 1fr> <list 1fr> <preview 25em>

## Solutions

- [x] Add new prisma TemplateCategory with id, name, color, isDefault
- [x] Add new record category of template, default is "Draft"
- [x] Add default category for all template, when create it auto set draft
- [x] Handle UI
- [x] Update data in database
