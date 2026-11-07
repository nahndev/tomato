-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#64748b',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
