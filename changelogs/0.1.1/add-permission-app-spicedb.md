# Add new app for permission using SpiceDB

## Currently

- The monorepo has `apps/api`, `apps/collab`, `apps/copilot`, `apps/web`; there is no dedicated place for authorization.
- Permission checks (company / department / role / document access) are not centralized.
- Goal: add a new app (e.g. `apps/permission`) that owns authorization and uses [SpiceDB](https://authzed.com/spicedb) (Zanzibar-style, relationship-based access control) as the engine.
- Other apps ask this app "can subject X do action Y on resource Z?" instead of embedding permission logic.

## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Solutions

- [ ]
- [ ]
- [ ]
