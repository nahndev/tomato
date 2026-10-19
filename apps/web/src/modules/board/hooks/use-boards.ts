"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../board.keys";
import type { CreateBoardInput } from "../board.schemas";
import { createBoard, deleteBoard, listBoards } from "../services/boards.service";

export function useBoards() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: boardKeys.all });

  const { data, isLoading, isError } = useQuery({ queryKey: boardKeys.all, queryFn: listBoards });

  const addMutation = useMutation({ mutationFn: (input: CreateBoardInput) => createBoard(input), onSuccess: invalidate });
  const removeMutation = useMutation({ mutationFn: (id: string) => deleteBoard(id), onSuccess: invalidate });

  return {
    boards: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: CreateBoardInput) => addMutation.mutateAsync(input),
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
