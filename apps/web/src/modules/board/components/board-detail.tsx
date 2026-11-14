"use client";

import { Button, Spinner, Tabs, TabsContent, TabsList, TabsTrigger, Toaster, Typography } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoardTab } from "../board.constants";
import { useBoard } from "../hooks/use-board";
import { ColumnSetting } from "./columns/column-setting";
import { BoardSubmissions } from "./submissions/board-submissions";

interface BoardDetailProps {
  boardId: string;
}

export function BoardDetail({ boardId }: BoardDetailProps) {
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
      <Tabs defaultValue={BoardTab.SUBMISSIONS}>
        <TabsList>
          <TabsTrigger value={BoardTab.SUBMISSIONS}><Typography>Submissions</Typography></TabsTrigger>
          <TabsTrigger value={BoardTab.COLUMNS}><Typography>Columns</Typography></TabsTrigger>
        </TabsList>
        <TabsContent value={BoardTab.SUBMISSIONS}>
          <BoardSubmissions board={board} />
        </TabsContent>
        <TabsContent value={BoardTab.COLUMNS}>
          <ColumnSetting board={board} onSave={update} isSaving={isUpdating} />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
