"use client";

import { BoardView } from "@tomato/constants";
import { Spinner, Toaster, Typography } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useBoard } from "../../hooks/use-board";
import { BoardSubmissions } from "./board-submissions";

interface BoardSubmissionPageProps {
  boardId: string;
  view?: string;
}

export function BoardSubmissionPage({ boardId, view }: BoardSubmissionPageProps) {
  const { board, isLoading, hasError } = useBoard(boardId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  if (hasError || !board) notFound();

  const isViewEnabled = {
    [BoardView.TABLE]: board.tableSetting.length > 0,
    [BoardView.TASK]: true,
    [BoardView.AGENDA]: Object.keys(board.agendaSetting).length > 0,
  };
  const views = Object.values(BoardView).filter((entry) => isViewEnabled[entry]);

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <Typography as="h1" className="truncate text-xl font-medium">{board.name}</Typography>
      </header>
      <BoardSubmissions board={board} views={views} view={views.find((entry) => entry === view) ?? views[0]} />
      <Toaster />
    </div>
  );
}
