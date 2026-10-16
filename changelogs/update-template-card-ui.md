# Update UI for TemplateCard

## Currently

- `TemplateCard` (`apps/web/src/modules/templates/components/content/template-card.tsx`) is a basic list item: template name, optional two-line description, and a delete icon button on the right.
- Its visual design has not been reviewed against the app's design system (`@tomato/ui`) or the recently updated template list / recent sections.
- Goal: update the UI of `TemplateCard` so it is consistent and polished with the rest of the templates page.

## Acceptance Criteria

- [x] Design include 2 path, missing header, content is preview image
- [x] Footer is <icon><name>
- [x] Footer next line is timestamp

## Solutions

- [x] Handle base on design
- [x] Update template prisma add record for preview image
- [x] Update api and design
