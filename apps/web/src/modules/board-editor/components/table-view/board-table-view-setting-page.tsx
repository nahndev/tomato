"use client";

import { useBoard } from "@/modules/board";
import { TableViewSetting } from "./table-view-setting";

export function BoardTableViewSettingPage({ boardId }: { boardId: string }) {
  const { board, update, isUpdating } = useBoard(boardId);

  if (!board) return null;

  return <TableViewSetting board={board} onSave={update} isSaving={isUpdating} />;
}
