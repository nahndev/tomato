"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../board.keys";
import type { UpdateBoardInput } from "../board.schemas";
import type { Board, BoardAgendaSettingInput, BoardColumn, BoardTaskSettingInput } from "../board.types";
import { getBoard, saveBoardAgenda, saveBoardTable, saveBoardTask, updateBoard } from "../services/boards.service";

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
  const saveTableMutation = useMutation({ mutationFn: (setting: BoardColumn[]) => saveBoardTable(id, setting), onSuccess: setBoard });
  const saveTaskMutation = useMutation({
    mutationFn: (setting: BoardTaskSettingInput[]) => saveBoardTask(id, setting),
    onSuccess: (board) => {
      setBoard(board);
      void queryClient.invalidateQueries({ queryKey: boardKeys.submissions(id) });
    },
  });

  const saveAgendaMutation = useMutation({
    mutationFn: (setting: BoardAgendaSettingInput[]) => saveBoardAgenda(id, setting),
    onSuccess: (board) => {
      setBoard(board);
      void queryClient.invalidateQueries({ queryKey: boardKeys.submissions(id) });
    },
  });

  return {
    board: data,
    isLoading,
    hasError: isError,
    update: async (input: UpdateBoardInput) => updateMutation.mutateAsync(input),
    isUpdating:
      updateMutation.isPending || saveTableMutation.isPending || saveTaskMutation.isPending || saveAgendaMutation.isPending,
    saveTable: async (setting: BoardColumn[]) => saveTableMutation.mutateAsync(setting),
    saveTask: async (setting: BoardTaskSettingInput[]) => saveTaskMutation.mutateAsync(setting),
    saveAgenda: async (setting: BoardAgendaSettingInput[]) => saveAgendaMutation.mutateAsync(setting),
  };
}
