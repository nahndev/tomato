-- CreateTable
CREATE TABLE "board_tasks" (
    "board_id" UUID NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_tasks_pkey" PRIMARY KEY ("board_id")
);

-- AddForeignKey
ALTER TABLE "board_tasks" ADD CONSTRAINT "board_tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- MoveData
INSERT INTO "board_tasks" ("board_id", "settings", "updated_at")
SELECT b."id", COALESCE((
    SELECT jsonb_object_agg(s."template_id"::text, jsonb_build_object(
        'typeWidget', s."type_widget",
        'titleWidget', s."title_widget",
        'statusWidget', s."status_widget",
        'assigneeWidget', s."assignee_widget",
        'conditions', s."conditions"
    ))
    FROM "board_template_task_settings" AS s
    WHERE s."board_id" = b."id"
), '{}'::jsonb), CURRENT_TIMESTAMP
FROM "boards" AS b;

-- DropForeignKey
ALTER TABLE "board_template_task_settings" DROP CONSTRAINT "board_template_task_settings_board_id_template_id_fkey";

-- DropTable
DROP TABLE "board_template_task_settings";
