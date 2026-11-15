"use client";

import { useBoard } from "@/modules/board";
import { Typography } from "@tomato/ui";
import { ViewSettingSection } from "../view-setting-section";

export function BoardAgendaViewSettingPage({ boardId }: { boardId: string }) {
  const { board } = useBoard(boardId);

  if (!board) return null;

  return (
    <ViewSettingSection title="Agenda view" description="Show the submissions of this board on an agenda.">
      <Typography as="p" className="text-sm text-muted-foreground">Not available yet.</Typography>
    </ViewSettingSection>
  );
}
