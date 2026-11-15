"use client";

import { useBoard } from "@/modules/board";
import { BoardView } from "@tomato/constants";
import { Typography } from "@tomato/ui";
import { ViewSettingSection } from "../view-setting-section";

export function BoardTaskViewSettingPage({ boardId }: { boardId: string }) {
  const { board, addView, removeView, isChangingView } = useBoard(boardId);

  if (!board) return null;

  return (
    <ViewSettingSection
      title="Task view"
      description="Show the submissions of this board as tasks."
      isEnabled={board.task !== null}
      isPending={isChangingView}
      onAdd={() => addView(BoardView.TASK)}
      onRemove={() => removeView(BoardView.TASK)}
    >
      <Typography as="p" className="text-sm text-muted-foreground">Not available yet.</Typography>
    </ViewSettingSection>
  );
}
