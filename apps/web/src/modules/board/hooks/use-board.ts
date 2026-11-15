"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoardView } from "@tomato/constants";
import { boardKeys } from "../board.keys";
import type { UpdateBoardInput } from "../board.schemas";
import type { Board, BoardColumn, BoardTaskSettingInput } from "../board.types";
import { addBoardView, getBoard, removeBoardView, saveBoardTable, saveBoardTask, updateBoard } from "../services/boards.service";

export function useBoard(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({ queryKey: boardKeys.detail(id), queryFn: () => getBoard(id) });

  const setBoard = (board: Board) => queryClient.setQueryData(boardKeys.detail(id), board);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateBoardInput) => updateBoard(id, input),
    onSuccess: (board) => {
      setBoard(board);
      void queryClient.invalidateQueries({ queryKey: boardKeys.all, exact: true });
    },
  });
  const saveTableMutation = useMutation({ mutationFn: (columns: BoardColumn[]) => saveBoardTable(id, columns), onSuccess: setBoard });
  const saveTaskMutation = useMutation({
    mutationFn: (settings: BoardTaskSettingInput[]) => saveBoardTask(id, settings),
    onSuccess: (board) => {
      setBoard(board);
      void queryClient.invalidateQueries({ queryKey: boardKeys.submissions(id) });
    },
  });
  const addViewMutation = useMutation({ mutationFn: (view: BoardView) => addBoardView(id, view), onSuccess: setBoard });
  const removeViewMutation = useMutation({
    mutationFn: (view: BoardView) => removeBoardView(id, view),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.detail(id), exact: true }),
  });

  return {
    board: data,
    isLoading,
    hasError: isError,
    update: async (input: UpdateBoardInput) => updateMutation.mutateAsync(input),
    isUpdating: updateMutation.isPending || saveTableMutation.isPending || saveTaskMutation.isPending,
    saveTable: async (columns: BoardColumn[]) => saveTableMutation.mutateAsync(columns),
    saveTask: async (settings: BoardTaskSettingInput[]) => saveTaskMutation.mutateAsync(settings),
    addView: async (view: BoardView) => {
      await addViewMutation.mutateAsync(view);
    },
    removeView: async (view: BoardView) => {
      await removeViewMutation.mutateAsync(view);
    },
    isChangingView: addViewMutation.isPending || removeViewMutation.isPending,
  };
}
