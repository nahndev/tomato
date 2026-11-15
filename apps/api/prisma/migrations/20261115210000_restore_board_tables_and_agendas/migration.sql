-- CreateTable
CREATE TABLE "board_tables" (
    "board_id" UUID NOT NULL,
    "columns" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_tables_pkey" PRIMARY KEY ("board_id")
);

-- CreateTable
CREATE TABLE "board_agendas" (
    "board_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_agendas_pkey" PRIMARY KEY ("board_id")
);

-- AddForeignKey
ALTER TABLE "board_tables" ADD CONSTRAINT "board_tables_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_agendas" ADD CONSTRAINT "board_agendas_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- MoveData
INSERT INTO "board_tables" ("board_id", "columns", "updated_at")
SELECT b."id", COALESCE((
    SELECT jsonb_agg(c.value || jsonb_build_object('items', COALESCE((
        SELECT jsonb_object_agg(s."template_id"::text, s."items"->(c.value->>'id'))
        FROM "board_template_table_settings" AS s
        WHERE s."board_id" = b."id" AND s."items" ? (c.value->>'id')
    ), '{}'::jsonb)) ORDER BY c.ordinality)
    FROM jsonb_array_elements(b."table_columns") WITH ORDINALITY AS c
), '[]'::jsonb), CURRENT_TIMESTAMP
FROM "boards" AS b;

INSERT INTO "board_agendas" ("board_id", "updated_at")
SELECT "id", CURRENT_TIMESTAMP FROM "boards";

-- DropTable
DROP TABLE "board_template_table_settings";

-- AlterTable
ALTER TABLE "boards" DROP COLUMN "table_columns";
