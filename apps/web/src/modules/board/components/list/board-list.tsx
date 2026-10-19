"use client";

import { Input, Spinner, Toaster, toast } from "@tomato/ui";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBoardPath } from "../../board.constants";
import type { CreateBoardInput } from "../../board.schemas";
import { useBoards } from "../../hooks/use-boards";
import { BoardCard } from "./board-card";
import { BoardCreateForm } from "./board-create-form";

export function BoardList() {
  const router = useRouter();
  const { boards, isLoading, hasError, add, remove } = useBoards();
  const [query, setQuery] = useState("");

  const visibleBoards = boards.filter((board) => board.name.toLowerCase().includes(query.toLowerCase()));

  async function handleCreate(input: CreateBoardInput) {
    const board = await add(input);
    router.push(getBoardPath(board.id));
  }

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the board");
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            aria-label="Search boards"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <BoardCreateForm onCreate={handleCreate} />
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">Could not load the boards.</p>
      ) : visibleBoards.length === 0 ? (
        <p className="text-sm text-muted-foreground">{boards.length === 0 ? "No boards yet." : "No board matches."}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
          {visibleBoards.map((board) => (
            <BoardCard key={board.id} board={board} onDelete={handleDelete} />
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
}
