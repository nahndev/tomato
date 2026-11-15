-- AlterTable
ALTER TABLE "boards" ADD COLUMN "table_columns" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "board_template_table_settings" (
    "board_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "items" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_template_table_settings_pkey" PRIMARY KEY ("board_id","template_id")
);

-- AddForeignKey
ALTER TABLE "board_template_table_settings" ADD CONSTRAINT "board_template_table_settings_board_id_template_id_fkey" FOREIGN KEY ("board_id", "template_id") REFERENCES "board_templates"("board_id", "template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- MoveData
UPDATE "boards" AS b
SET "table_columns" = (
    SELECT COALESCE(jsonb_agg(c.value - 'items' ORDER BY c.ordinality), '[]')
    FROM "board_tables" AS t, jsonb_array_elements(t."columns") WITH ORDINALITY AS c
    WHERE t."board_id" = b."id"
);

INSERT INTO "board_template_table_settings" ("board_id", "template_id", "items", "updated_at")
SELECT bt."board_id", bt."template_id", jsonb_object_agg(c.value->>'id', c.value->'items'->(bt."template_id"::text)), CURRENT_TIMESTAMP
FROM "board_templates" AS bt
JOIN "board_tables" AS t ON t."board_id" = bt."board_id"
CROSS JOIN jsonb_array_elements(t."columns") AS c
WHERE c.value->'items' ? (bt."template_id"::text)
GROUP BY bt."board_id", bt."template_id";

-- DropTable
DROP TABLE "board_tables";

-- DropTable
DROP TABLE "board_agendas";
