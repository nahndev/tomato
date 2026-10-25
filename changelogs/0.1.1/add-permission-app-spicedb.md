# Add new app for permission using SpiceDB

## Currently

- The monorepo has `apps/api`, `apps/collab`, `apps/copilot`, `apps/web`; there is no dedicated place for authorization.
- Permission checks (company / department / role / document access) are not centralized.
- Goal: add a new app (e.g. `apps/permission`) that owns authorization and uses [SpiceDB](https://authzed.com/spicedb) (Zanzibar-style, relationship-based access control) as the engine.
- Other apps ask this app "can subject X do action Y on resource Z?" instead of embedding permission logic.

## Solutions

- [x] Add `docs/cdc.md` is setup document for CDC in my system
  - Update Postgresql allow connect by `debezium`
  - Setup `kafka` and `debezium` by docker
- [x] Config and setup kafka service in docker
- [x] Add new `apps` is `authorize` with `spiceDb`
- [x] Add new `module` in `authorize` using `kafkajs` insert data for `spiceDb`
- [x] Rules for spice:
  - When add user -> add relationship to department
  - When add document -> add relationship to department, add relationship owner
