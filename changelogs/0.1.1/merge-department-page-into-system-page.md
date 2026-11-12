# Merge department page into system page

## Currently

- The department workspace lives at `/department/{slug}` (`user`, `documents`, `roles`, `permissions`), separate from the `/system` pages.
- It has its own layout with `DepartmentSidebar`, so opening a department replaces `AppSidebar`; users return through the `System` button in the sidebar footer.
- The department list stays inside the system at `/system/departments`, so moving from the list to a department leaves the system UI.

## Acceptance Criteria

- [x] Merge page /department/slug to system/departments/slug
- [x] Merge menu
- [x] Merge all pages
- [x] Merge other menus

## Solutions

- [x] Move `app/department/[slug]` to `app/system/departments/[slug]`, under the system layout
- [x] `DepartmentSidebar` only renders the department sections, next to the page content
- [x] Replace the `Departments` item in `AppSidebar` with a `Departments` group listing the departments; the group label links to `/system/departments`
- [x] Add an `Add department` item at the bottom of the group
- [x] `/system/departments/{slug}` redirects to the first department section
- [x] `DepartmentMenu` uses its own query key, because sharing the list query breaks hydration of `DepartmentList`
