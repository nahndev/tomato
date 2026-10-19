"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../board.keys";
import type { UpdateBoardInput } from "../board.schemas";
import { getBoard, updateBoard } from "../services/boards.service";

export function useBoard(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({ queryKey: boardKeys.detail(id), queryFn: () => getBoard(id) });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateBoardInput) => updateBoard(id, input),
    onSuccess: (board) => {
      queryClient.setQueryData(boardKeys.detail(id), board);
      void queryClient.invalidateQueries({ queryKey: boardKeys.all, exact: true });
    },
  });

  return {
    board: data,
    isLoading,
    hasError: isError,
    update: async (input: UpdateBoardInput) => updateMutation.mutateAsync(input),
    isUpdating: updateMutation.isPending,
  };
}
