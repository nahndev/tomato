# Scripts

Run from anywhere in the repo. Everyday tasks stay in `package.json` (`pnpm dev`, `pnpm test`, `pnpm migrate`, ...).

The root `Makefile` wraps these: `make setup`, `make db-init`, `make cdc snapshot users departments`.

| Command                                 | Purpose                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `scripts/setup.sh`                      | First-time setup: install, create missing env files, start Docker services, apply migrations           |
| `scripts/db-init.sh`                    | Apply `docker/postgres/init.sql` to an existing volume; ignore "already exists" errors                 |
| `scripts/cdc.sh status`                 | Show the Debezium connector status                                                                     |
| `scripts/cdc.sh register`               | Create or update the connector from `docker/debezium/tomato-connector.json`                            |
| `scripts/cdc.sh snapshot [table...]`    | Replay existing rows as `r` events, see [docs/cdc.md](../docs/cdc.md#incremental-snapshot)             |
| `scripts/cdc.sh stop-snapshot [table...]` | Stop a running incremental snapshot                                                                  |

`setup.sh` never overwrites an existing env file. `db-init.sh` recreates the `postgres` container, the data stays in its volume. Without tables, the snapshot commands use every captured table of the connector config.
