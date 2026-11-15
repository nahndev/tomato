-- CreateTable
CREATE TABLE "board_template_task_settings" (
    "board_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "type_widget" TEXT,
    "title_widget" TEXT,
    "status_widget" TEXT,
    "assignee_widget" TEXT,
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_template_task_settings_pkey" PRIMARY KEY ("board_id","template_id")
);

-- AddForeignKey
ALTER TABLE "board_template_task_settings" ADD CONSTRAINT "board_template_task_settings_board_id_template_id_fkey" FOREIGN KEY ("board_id", "template_id") REFERENCES "board_templates"("board_id", "template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_template_task_settings" ADD CONSTRAINT "board_template_task_settings_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board_tasks"("board_id") ON DELETE CASCADE ON UPDATE CASCADE;

