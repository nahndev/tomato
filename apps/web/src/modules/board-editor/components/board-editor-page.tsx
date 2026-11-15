"use client";

import { useBoard } from "@/modules/board";
import { Button, Spinner, Toaster, Typography } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ColumnSetting } from "./column-setting";

interface BoardEditorPageProps {
  boardId: string;
}

export function BoardEditorPage({ boardId }: BoardEditorPageProps) {
  const { board, isLoading, hasError, update, isUpdating } = useBoard(boardId);

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
      <header className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to boards">
          <Link href="/system/boards">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <Typography as="h1" className="truncate text-xl font-medium">{board.name}</Typography>
      </header>
      <ColumnSetting board={board} onSave={update} isSaving={isUpdating} />
      <Toaster />
    </div>
  );
}
