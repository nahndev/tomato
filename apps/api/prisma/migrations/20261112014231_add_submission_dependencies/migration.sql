-- CreateTable
CREATE TABLE "submission_dependencies" (
    "id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "refer" TEXT,
    "idempotency_key" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submission_dependencies_target_id_idx" ON "submission_dependencies"("target_id");

-- CreateIndex
CREATE INDEX "submission_dependencies_refer_idx" ON "submission_dependencies"("refer");

-- CreateIndex
CREATE UNIQUE INDEX "submission_dependencies_source_id_idempotency_key_key" ON "submission_dependencies"("source_id", "idempotency_key");

-- AddForeignKey
ALTER TABLE "submission_dependencies" ADD CONSTRAINT "submission_dependencies_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_dependencies" ADD CONSTRAINT "submission_dependencies_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "submission_dependencies" ADD CONSTRAINT "submission_dependencies_no_self_check" CHECK ("source_id" <> "target_id");
