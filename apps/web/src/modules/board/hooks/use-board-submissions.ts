"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../board.keys";
import { createSubmission, deleteSubmission, listBoardSubmissions } from "../services/board-submissions.service";

export function useBoardSubmissions(boardId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: boardKeys.submissions(boardId) });

  const { data, isLoading, isError } = useQuery({
    queryKey: boardKeys.submissions(boardId),
    queryFn: () => listBoardSubmissions(boardId),
  });

  const addMutation = useMutation({
    mutationFn: (templateId: string) => createSubmission(boardId, templateId),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({ mutationFn: (id: string) => deleteSubmission(id), onSuccess: invalidate });

  return {
    submissions: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (templateId: string) => addMutation.mutateAsync(templateId),
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
