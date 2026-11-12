-- Snapshots published before links existed have no "links" key.
UPDATE "template_versions"
SET "snapshot" = jsonb_set("snapshot", '{links}', '{}'::jsonb)
WHERE NOT ("snapshot" ? 'links');
