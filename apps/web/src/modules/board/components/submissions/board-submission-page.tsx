"use client";

import { Spinner, Toaster, Typography } from "@tomato/ui";
import { notFound } from "next/navigation";
import { BoardView } from "../../board.constants";
import { useBoard } from "../../hooks/use-board";
import { BoardSubmissions } from "./board-submissions";

interface BoardSubmissionPageProps {
  boardId: string;
  view?: string;
}

export function BoardSubmissionPage({ boardId, view }: BoardSubmissionPageProps) {
  const boardView = Object.values(BoardView).find((entry) => entry === view) ?? BoardView.TABLE;
  const { board, isLoading, hasError } = useBoard(boardId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  if (hasError || !board) notFound();

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <Typography as="h1" className="truncate text-xl font-medium">{board.name}</Typography>
      </header>
      <BoardSubmissions board={board} view={boardView} />
      <Toaster />
    </div>
  );
}
