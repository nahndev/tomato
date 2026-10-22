# Update design of template create form

## Currently

- `TemplateCreateForm` (`apps/web/src/modules/templates/components/template-create-form.tsx`) is a bare inline form: a single plain `<input>` (fixed `w-64`) next to an "Add" button.
- No label, helper text, validation feedback or loading state beyond the disabled button; visually inconsistent with the rest of the app's shadcn/ui styling.
- Goal: redesign the form so it matches the app's design system (`@tomato/ui`) and gives clear feedback to the user.

## Acceptance Criteria

- [x] Top on tabs with `All`, `Closed`, ...
- [x] Right on top is `create` button
- [x] Bottom is filter with <input><button>

## Solutions

- [x] Implement new UI
- [x] Split into 3 component (for top, for bottom, for top on right)
- [x] Center horizontal layout
