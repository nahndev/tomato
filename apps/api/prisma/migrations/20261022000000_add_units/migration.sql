-- CreateTable
CREATE TABLE "unit_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "type_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unit_types_name_key" ON "unit_types"("name");

-- CreateIndex
CREATE INDEX "units_type_id_idx" ON "units"("type_id");

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "unit_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Seed default unit types
INSERT INTO "unit_types" ("id", "name", "is_default", "updated_at")
VALUES
    (gen_random_uuid(), 'client', true, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'department', true, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'office', true, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'team', true, CURRENT_TIMESTAMP);

-- Seed the system unit (client)
INSERT INTO "units" ("id", "name", "is_system", "type_id", "updated_at")
VALUES (gen_random_uuid(), 'Client', true, (SELECT "id" FROM "unit_types" WHERE "name" = 'client'), CURRENT_TIMESTAMP);
