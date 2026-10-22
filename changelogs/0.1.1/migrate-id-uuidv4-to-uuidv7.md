# Migrate id from uuidv4 to uuidv7

## Currently

- All models in `apps/api/prisma/schema.prisma` generate `id` with `@default(uuid())` (uuidv4, `@db.Uuid`).
- uuidv4 is fully random, so inserts hit random B-tree index pages (fragmentation, poor locality) and ids are not sortable by creation time.
- Goal: switch id generation to uuidv7 (time-ordered).
- Existing data in the database may be deleted, so no data-preserving migration is required (reset/re-seed is fine).

## Acceptance Criteria

- [ ] Clear all database data
- [x] All uuid of database using v7
- [x] All uuid of front-end and backend (all services) using v7

## Solutions

- [x] Prisma: `@default(uuid())` -> `@default(uuid(7))` on all models (generated client-side; PostgreSQL 17 has no native `uuidv7()`)
- [x] Add `generateId()` (uuid v7) to `@tomato/utils`; replace `crypto.randomUUID()` in web
- [x] Migration `use_uuid_v7`: add `uuid_v7()` SQL function and re-key seeded rows (categories, unit types, units)
- [ ] Clear all database data: run `pnpm --filter @tomato/api exec prisma migrate reset` (pending, needs manual run)
