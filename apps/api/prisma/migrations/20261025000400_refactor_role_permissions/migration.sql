-- Resource becomes "<type>:<id|all>"; existing grants apply to every item of the type
UPDATE "role_permissions" SET "resource" = "resource" || ':all' WHERE position(':' in "resource") = 0;

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_department_id_fkey";

-- DropIndex
DROP INDEX "role_permissions_department_id_idx";

-- AlterTable
ALTER TABLE "role_permissions" DROP COLUMN "department_id";
