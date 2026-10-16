# Add TemplateCard and TemplateList components

## Currently

- The template list page needs dedicated, reusable components instead of a single monolithic one.
- Components to add (in `apps/web/src/modules/templates/components/`):
  - `TemplateCard` — displays a single template.
  - `TemplateList` — container that renders the list; composed of:
    - `TemplateListHeader` — list header (title, actions, ...).
    - `TemplateListItem` — a single item/row in the list.
- Goal: split the template list UI into small, composable components with clear responsibilities.

## Acceptance Criteria

- [x] `TemplateCard` renders a single template (grid view)
- [x] `TemplateList` renders `TemplateListHeader` + one `TemplateListItem` per template (list view)
- [x] Grid / list view can be switched on the templates page

## Solutions

- [x] Existing page container `TemplateList` renamed to `TemplateBrowser` to free the name
- [x] Add `TemplateListHeader`, `TemplateListItem`, `TemplateList` (shared column layout in `templates.constants.ts`)
- [x] `TemplateContent` takes a `view` prop; `TemplateViewToggle` switches grid / list
