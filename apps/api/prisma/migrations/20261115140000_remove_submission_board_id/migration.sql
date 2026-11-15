-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_board_id_fkey";

-- DropIndex
DROP INDEX "submissions_board_id_idx";

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "board_id";
