-- DropIndex
DROP INDEX "role_permissions_role_id_resource_key";

-- AlterTable
ALTER TABLE "role_permissions"
  ADD COLUMN "resource_type" TEXT,
  ADD COLUMN "resource_id" TEXT;

UPDATE "role_permissions"
SET "resource_type" = split_part("resource", ':', 1),
    "resource_id" = split_part("resource", ':', 2);

ALTER TABLE "role_permissions"
  ALTER COLUMN "resource_type" SET NOT NULL,
  ALTER COLUMN "resource_id" SET NOT NULL,
  DROP COLUMN "resource";

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_resource_type_resource_id_key" ON "role_permissions"("role_id", "resource_type", "resource_id");
