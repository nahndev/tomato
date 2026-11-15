"use client";

import { useBoard } from "@/modules/board";
import { AgendaViewSetting } from "./agenda-view-setting";

export function BoardAgendaViewSettingPage({ boardId }: { boardId: string }) {
  const { board, saveAgenda, isUpdating } = useBoard(boardId);

  if (!board) return null;

  return <AgendaViewSetting board={board} onSave={saveAgenda} isSaving={isUpdating} />;
}
