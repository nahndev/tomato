-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "resource" TEXT NOT NULL,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_read" BOOLEAN NOT NULL DEFAULT false,
    "can_update" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "role_permissions_department_id_idx" ON "role_permissions"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_resource_key" ON "role_permissions"("role_id", "resource");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CDC: delete/update events must carry the old row to revoke relationships
ALTER TABLE "role_permissions" REPLICA IDENTITY FULL;
