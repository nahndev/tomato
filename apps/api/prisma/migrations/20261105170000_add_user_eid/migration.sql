-- AlterTable
ALTER TABLE "users" ADD COLUMN     "eid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_department_id_eid_key" ON "users"("department_id", "eid");

