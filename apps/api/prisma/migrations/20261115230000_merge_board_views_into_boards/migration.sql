-- AlterTable
ALTER TABLE "boards" ADD COLUMN "table_setting" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "task_setting" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "agenda_setting" JSONB NOT NULL DEFAULT '{}';

-- MoveData
UPDATE "boards" AS b SET
    "table_setting" = COALESCE((SELECT t."columns" FROM "board_tables" AS t WHERE t."board_id" = b."id"), '[]'::jsonb),
    "task_setting" = COALESCE((SELECT t."settings" FROM "board_tasks" AS t WHERE t."board_id" = b."id"), '{}'::jsonb);

-- DropForeignKey
ALTER TABLE "board_tables" DROP CONSTRAINT "board_tables_board_id_fkey";

-- DropForeignKey
ALTER TABLE "board_tasks" DROP CONSTRAINT "board_tasks_board_id_fkey";

-- DropForeignKey
ALTER TABLE "board_agendas" DROP CONSTRAINT "board_agendas_board_id_fkey";

-- DropTable
DROP TABLE "board_tables";

-- DropTable
DROP TABLE "board_tasks";

-- DropTable
DROP TABLE "board_agendas";
