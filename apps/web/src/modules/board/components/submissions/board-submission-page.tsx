"use client";

import { Button, Spinner, Toaster, Typography } from "@tomato/ui";
import { Settings2Icon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useBoard } from "../../hooks/use-board";
import { BoardSubmissions } from "./board-submissions";

interface BoardSubmissionPageProps {
  boardId: string;
}

export function BoardSubmissionPage({ boardId }: BoardSubmissionPageProps) {
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
        <Button asChild variant="ghost" size="icon" aria-label="Edit columns">
          <Link href={`/system/boards/${board.id}`}>
            <Settings2Icon />
          </Link>
        </Button>
      </header>
      <BoardSubmissions board={board} />
      <Toaster />
    </div>
  );
}
