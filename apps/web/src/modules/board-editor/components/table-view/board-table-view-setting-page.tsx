"use client";

import { useBoard } from "@/modules/board";
import { TableViewSetting } from "./table-view-setting";

export function BoardTableViewSettingPage({ boardId }: { boardId: string }) {
  const { board, saveTable, isUpdating } = useBoard(boardId);

  if (!board) return null;

  return <TableViewSetting board={board} onSave={saveTable} isSaving={isUpdating} />;
}
