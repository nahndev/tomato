-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_key",
ADD COLUMN     "avatar_file_id" UUID;
