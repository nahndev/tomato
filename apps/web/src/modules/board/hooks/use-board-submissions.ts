"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimeEvent, RealtimeRoom } from "@tomato/constants";
import { toRealtimeRoom } from "@tomato/utils";
import { useMemo } from "react";
import type { PaginatedResponse } from "@/shared/types/api.types";
import { useRealtimeEvent, useRealtimeRooms } from "@/shared/lib/realtime";
import { boardKeys } from "../board.keys";
import type { Submission, SubmissionValues } from "../board.types";
import { createSubmission, deleteSubmission, listBoardSubmissions } from "../services/board-submissions.service";

export function useBoardSubmissions(boardId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: boardKeys.submissions(boardId) });

  const { data, isLoading, isError } = useQuery({
    queryKey: boardKeys.submissions(boardId),
    queryFn: () => listBoardSubmissions(boardId),
  });

  useRealtimeRooms(useMemo(() => [toRealtimeRoom(RealtimeRoom.BOARD, boardId)], [boardId]));
  useRealtimeEvent<SubmissionValues>(RealtimeEvent.SUBMISSION_VALUES, (values) => {
    if (values.boardId !== boardId) return;
    queryClient.setQueryData<PaginatedResponse<Submission>>(boardKeys.submissions(boardId), (page) =>
      page && { ...page, items: page.items.map((item) => (item.id === values.id ? { ...item, ...values } : item)) },
    );
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
