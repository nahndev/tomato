-- DropForeignKey
ALTER TABLE "maps" DROP CONSTRAINT "maps_department_id_fkey";

-- DropIndex
DROP INDEX "maps_department_id_idx";

-- AlterTable
ALTER TABLE "maps" DROP COLUMN "department_id";
