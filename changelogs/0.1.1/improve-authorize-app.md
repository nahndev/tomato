# Improve authorize app

## Currently

- `apps/authorize` only syncs data into SpiceDB through CDC; it has no HTTP surface, so other apps cannot ask "can subject X do action Y on resource Z?".
- Sync is incomplete: `users` and `documents` handle inserts only (a user moving department, removed users and documents are not synced), and roles are not synced (no `role#department`, no `role#member`, so granted role permissions have no effect yet).
- Goal: make the authorize app complete and usable by the other apps.

## Solutions

- [x] Instead `cdcService` support for all event, split into multiple service for every event
- [x] Allow duplicate code
- [x] Create `documentResourceService`
- [x] Create `userResourceService`
- [x] Create `relationshipService`
- [x] Create `ResourceFactory::create(type, payload)` return `Resource`
- [x] Create `UserResource`, `DocumentResource`, `RolePermissionRelationShip`, ...
