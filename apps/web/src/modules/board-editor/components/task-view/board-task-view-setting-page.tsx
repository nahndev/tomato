"use client";

import { useBoard } from "@/modules/board";
import { BoardView } from "@tomato/constants";
import { TaskViewSetting } from "./task-view-setting";

export function BoardTaskViewSettingPage({ boardId }: { boardId: string }) {
  const { board, saveTask, isUpdating, addView, removeView, isChangingView } = useBoard(boardId);

  if (!board) return null;

  return (
    <TaskViewSetting
      key={board.task?.createdAt ?? BoardView.TASK}
      board={board}
      onSave={saveTask}
      isSaving={isUpdating}
      onAdd={() => addView(BoardView.TASK)}
      onRemove={() => removeView(BoardView.TASK)}
      isChangingView={isChangingView}
    />
  );
}
