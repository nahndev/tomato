"use client";

import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "../board.keys";
import { listBoards } from "../services/boards.service";

export function useBoardMenu() {
  const { data } = useQuery({ queryKey: boardKeys.menu(), queryFn: listBoards });

  return { boards: data?.items ?? [] };
}
