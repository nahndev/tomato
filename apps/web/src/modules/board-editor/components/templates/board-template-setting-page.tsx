"use client";

import { useBoard } from "@/modules/board";
import { TemplateSetting } from "./template-setting";

export function BoardTemplateSettingPage({ boardId }: { boardId: string }) {
  const { board, update, isUpdating } = useBoard(boardId);

  if (!board) return null;

  return <TemplateSetting board={board} onSave={update} isSaving={isUpdating} />;
}
