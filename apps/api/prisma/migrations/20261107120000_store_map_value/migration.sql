-- Existing maps are cleared: pins and the image move into "value".
-- DropTable
DROP TABLE "map_pins";

-- DeleteData
DELETE FROM "maps";

-- AlterTable
ALTER TABLE "maps" DROP COLUMN "image_file_id",
ADD COLUMN     "value" JSONB NOT NULL;
