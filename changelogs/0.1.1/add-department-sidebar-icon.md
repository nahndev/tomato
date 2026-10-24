# Add tomato icon prefix to department name in sidebar and make share component

## Currently

- The department sidebar (`department-workspace`) shows only the department name at the top (`department-sidebar.tsx`).
- The system sidebar (`AppSidebar`) already shows the tomato logo (`/logo.svg`).
- Goal: prefix the department name in the department sidebar with the tomato icon so both sidebars look consistent.

## Acceptance Criteria

- [x] Add `BrandMark` component for logo with `logo.svg` only
- [x] Add `PrimaryLogo` component for logo with `logo.svg` + `logo-bar.svg`
- [x] Update `AppSidebar` using `PrimaryLogo`
- [x] Update `DepartmentSidebar`, before department name add `BrandMark`
