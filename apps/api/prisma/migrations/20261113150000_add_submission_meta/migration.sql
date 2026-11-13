-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "meta_clocks" JSONB NOT NULL DEFAULT '{}';
