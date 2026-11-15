"use client";

import { useBoard } from "@/modules/board";
import { BoardView } from "@tomato/constants";
import { Typography } from "@tomato/ui";
import { ViewSettingSection } from "../view-setting-section";

export function BoardAgendaViewSettingPage({ boardId }: { boardId: string }) {
  const { board, addView, removeView, isChangingView } = useBoard(boardId);

  if (!board) return null;

  return (
    <ViewSettingSection
      title="Agenda view"
      description="Show the submissions of this board on an agenda."
      isEnabled={board.agenda !== null}
      isPending={isChangingView}
      onAdd={() => addView(BoardView.AGENDA)}
      onRemove={() => removeView(BoardView.AGENDA)}
    >
      <Typography as="p" className="text-sm text-muted-foreground">Not available yet.</Typography>
    </ViewSettingSection>
  );
}
