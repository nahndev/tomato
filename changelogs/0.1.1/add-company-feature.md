# Add unit feature

## Currently

- The system has no concept of a unit yet.
- Add a unit feature (API + web) so companies can be created, viewed, updated and deleted.

## Acceptance Criteria

- [x] Add new feature `Unit`
- [x] Add menu in workspace with `units`
- [x] Unit include name
- [x] System default include a unit as client
- [x] System include multiple units with multiple type

## Solutions

- [x] create table `unit` with (uuid, name, isSystem, type)
- [x] create default `unit`
- [x] add `ClientService` add function load() return `isSystem` unit.
- [x] Support CRUD for unit
- [x] Support CRUD for unitType, default is `client`, `department`, `office`, `team`
