# Move maps to a global scope shared by all departments

## Currently

- Each map belongs to one department: Prisma `DepartmentMap` (`maps` table) has a required `departmentId` (cascade delete with the department) and is indexed by it.
- API `modules/maps`: maps are listed and created through `departments/:departmentId/maps` (`DepartmentMapsController`); `MapsService.list`/`create` check the department first, and `MapsRepository.findMany`/`create` filter or write by `departmentId`. Get, update and delete already use `maps/:id` (`MapsController`). The entity type is `DepartmentMapEntity`.
- Web `modules/map`: the list is only reachable at `system/departments/[slug]/maps` (the "Maps" item in the department workspace menu, `DepartmentSection.MAPS`); `useMaps(departmentId)`, `listMaps`/`createMap` and the query keys `["departments", departmentId, "maps"]` are scoped to a department.
- Map detail `maps/[id]`: the back link in `MapLeading` goes to the department's maps page, `useMap` invalidates the department's list, and `MapExtension` only lets the user pick images from that department's files (`GroupType.DEPARTMENT`).
- So a map can't be shared: another department that needs the same map has to create its own copy and re-upload the images.

## Acceptance Criteria

- [x] The `Management` group add `Map` item
- [x] The `DepartmentMap` change to `Map`
- [x] The `CanvasTool` split `square`, `canvas`, `circle`, `pin` into zone group, other tools into other group
- [x] The `Canvas` add props `hasZoneTools` kich hoac cho phep cong cu `zone`

## Solutions

- [x] Prisma `DepartmentMap` → `Map` without `departmentId` (the `departments.maps` relation is removed); migration `move_maps_to_global_scope` drops `maps.department_id`, its index and foreign key, and keeps the existing maps
- [x] API `modules/maps`: `DepartmentMapsController` removed, `MapsController` serves `maps` (list, create) and `maps/:id` (get, update, delete); `MapsService`/`MapsRepository` no longer take a department (`DepartmentsModule` import dropped); `DepartmentMapEntity` → `MapEntity`
- [x] Web `modules/map`: `DepartmentMap` → `Map` (no `departmentId`); `listMaps`/`createMap` call `/maps`; `useMaps()` and `MapList` take no department; query keys `mapKeys.list` (`["maps", "list"]`) and `mapKeys.detail(id)` (`["maps", "detail", id]`), so invalidating the list leaves the open map alone; `MapLeading` links back to `/system/maps`; `MapExtension` picks images without a group limit
- [x] Web routes: `system/maps` page added and linked as "Maps" in the `Management` group (`SYSTEM_NAV_ITEMS`); `system/departments/[slug]/maps` and `DepartmentSection.MAPS` removed
- [x] `@tomato/canvas`: `ZONE_TOOLS` (rectangle, ellipse, polygon, icon); the toolbar groups the icon menu and the rectangle, ellipse and polygon tools apart from text and arrow; `Canvas`/`StateProvider` take `hasZoneTools` (default `false`), kept in the canvas state; without it the zone group is hidden and its hotkeys are ignored; `MapPage` passes `hasZoneTools`
