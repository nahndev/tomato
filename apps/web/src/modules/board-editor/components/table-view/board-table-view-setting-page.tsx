"use client";

import { useBoard } from "@/modules/board";
import { BoardView } from "@tomato/constants";
import { TableViewSetting } from "./table-view-setting";

export function BoardTableViewSettingPage({ boardId }: { boardId: string }) {
  const { board, saveTable, isUpdating, addView, removeView, isChangingView } = useBoard(boardId);

  if (!board) return null;

  return (
    <TableViewSetting
      key={board.table?.createdAt ?? BoardView.TABLE}
      board={board}
      onSave={saveTable}
      isSaving={isUpdating}
      onAdd={() => addView(BoardView.TABLE)}
      onRemove={() => removeView(BoardView.TABLE)}
      isChangingView={isChangingView}
    />
  );
}
