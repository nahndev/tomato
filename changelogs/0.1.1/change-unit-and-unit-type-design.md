# Change design of unit and unit-type

## Currently

- Unit and unit-type were added in `add-unit-feature` (see `docs/units.md`).
- Current design:
  - `unit_types`: `name` (unique), `is_default`; seeded with `client`, `department`, `office`, `team`.
  - `units`: `name`, `is_system`, `type_id`; one seeded system unit `Client`.
  - Units are a flat list; there is no hierarchy between units.
  - Web: `/workspace/units` with two tabs, **Units** and **Types**.
- The design needs to change; the new design is to be defined.

## Acceptance Criteria

- [ ] Instead of generic unit for multiple type, remove unit and unit-type
- [x] Replace by `department` with (name)

## Solutions

- [ ] remove entity `unit` and `unit-type`
- [x] Create entity `department`
- [x] Support CRUD for `department`
- [x] Create menu for `department`
- [x] Support new decoration @IsName() with isString, min is 1 and max is 100 charactors, apply it.
