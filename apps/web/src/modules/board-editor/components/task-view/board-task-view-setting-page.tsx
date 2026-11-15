"use client";

import { useBoard } from "@/modules/board";
import { TaskViewSetting } from "./task-view-setting";

export function BoardTaskViewSettingPage({ boardId }: { boardId: string }) {
  const { board, saveTask, isUpdating } = useBoard(boardId);

  if (!board) return null;

  return <TaskViewSetting board={board} onSave={saveTask} isSaving={isUpdating} />;
}
