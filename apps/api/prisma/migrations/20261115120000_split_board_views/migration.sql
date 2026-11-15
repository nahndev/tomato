-- CreateTable
CREATE TABLE "board_tables" (
    "board_id" UUID NOT NULL,
    "columns" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_tables_pkey" PRIMARY KEY ("board_id")
);

-- CreateTable
CREATE TABLE "board_tasks" (
    "board_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_tasks_pkey" PRIMARY KEY ("board_id")
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
ALTER TABLE "board_tasks" ADD CONSTRAINT "board_tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_agendas" ADD CONSTRAINT "board_agendas_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill
INSERT INTO "board_tables" ("board_id", "columns", "updated_at")
SELECT "id", "columns", CURRENT_TIMESTAMP FROM "boards";

-- AlterTable
ALTER TABLE "boards" DROP COLUMN "columns";
