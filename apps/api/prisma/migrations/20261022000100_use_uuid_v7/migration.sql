-- uuidv7 generator (native uuidv7() only exists in PostgreSQL 18+)
CREATE FUNCTION uuid_v7() RETURNS uuid AS $$
  SELECT encode(
    set_bit(
      set_bit(
        overlay(
          uuid_send(gen_random_uuid())
          placing substring(int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint) FROM 3)
          FROM 1 FOR 6
        ),
        52, 1
      ),
      53, 1
    ),
    'hex'
  )::uuid;
$$ LANGUAGE sql VOLATILE;

-- Re-key seeded rows (foreign keys cascade on update)
UPDATE "template_categories" SET "id" = uuid_v7();
UPDATE "unit_types" SET "id" = uuid_v7();
UPDATE "units" SET "id" = uuid_v7();
