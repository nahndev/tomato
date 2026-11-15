"use client";

import { useBoard } from "@/modules/board";
import { SidebarNav } from "@/modules/system";
import { Button, Spinner, Toaster, Typography } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BOARD_SETTING_SECTIONS } from "../board-editor.constants";

interface BoardSettingsLayoutProps {
  boardId: string;
  children: ReactNode;
}

export function BoardSettingsLayout({ boardId, children }: BoardSettingsLayoutProps) {
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
      <header className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to boards">
          <Link href="/system/boards">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <Typography as="h1" className="truncate text-xl font-medium">{board.name}</Typography>
      </header>
      <div className="flex min-w-0 flex-1 gap-6">
        <aside className="w-48 shrink-0">
          <SidebarNav items={BOARD_SETTING_SECTIONS} basePath={`/system/boards/${boardId}/settings`} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
