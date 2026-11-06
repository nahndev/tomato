-- RenameColumn
ALTER TABLE "files" RENAME COLUMN "storage_key" TO "object_id";

-- RenameIndex
ALTER INDEX "files_storage_key_key" RENAME TO "files_object_id_key";
