# Add workspace layout for website

## Currently

- The website (`apps/web`) has no workspace layout yet; pages have no shared shell (e.g. sidebar, header, content area).
- Goal: add a reusable workspace layout for the authenticated/working area of the website so feature pages can plug into a consistent structure.

## Acceptance Criteria

- [x] Add new /workspace, left is app-sidebar
- [x] AppSidebar include /templates, /boards, ...
- [x] AppSidebar is vertical icons click, top is Logo

## Solutions

- [x] Add new component `app-sidebar`
- [x] Add all icons and navigator
- [x] Add all pages
- [x] Add loader
- [x] Add component with shadcn/ui
