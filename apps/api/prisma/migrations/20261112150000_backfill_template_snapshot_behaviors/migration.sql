-- Snapshots published before behaviors existed have no "behaviors" key.
UPDATE "template_versions"
SET "snapshot" = jsonb_set("snapshot", '{behaviors}', '{}'::jsonb)
WHERE NOT ("snapshot" ? 'behaviors');
