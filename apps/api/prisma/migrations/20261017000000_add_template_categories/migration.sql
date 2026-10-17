-- CreateTable
CREATE TABLE "template_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "template_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_categories_name_key" ON "template_categories"("name");

-- Seed default category
INSERT INTO "template_categories" ("id", "name", "color", "is_default")
VALUES (gen_random_uuid(), 'Draft', '#94a3b8', true);

-- AlterTable
ALTER TABLE "templates" ADD COLUMN "category_id" UUID;

-- Backfill existing templates with the default category
UPDATE "templates"
SET "category_id" = (SELECT "id" FROM "template_categories" WHERE "is_default" = true LIMIT 1);

-- AlterTable
ALTER TABLE "templates" ALTER COLUMN "category_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "templates_category_id_idx" ON "templates"("category_id");

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "template_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
