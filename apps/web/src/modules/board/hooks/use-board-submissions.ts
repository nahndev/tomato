"use client";

import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoardView, RealtimeEvent, RealtimeRoom } from "@tomato/constants";
import { toRealtimeRoom } from "@tomato/utils";
import { useMemo } from "react";
import type { PaginatedResponse } from "@/shared/types/api.types";
import { useRealtimeEvent, useRealtimeRooms } from "@/shared/lib/realtime";
import { boardKeys } from "../board.keys";
import type { Board, Submission, SubmissionValues } from "../board.types";
import { createSubmission, deleteSubmission, listBoardViewSubmissions } from "../services/board-submissions.service";

export function useBoardSubmissions(board: Board, view: BoardView | undefined) {
  const queryClient = useQueryClient();
  const templateIds = useMemo(() => board.templates.map((template) => template.templateId), [board.templates]);
  const isTask = view === BoardView.TASK;
  const queryKey = boardKeys.viewSubmissions(board.id, templateIds, view);
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: view && templateIds.length > 0 ? () => listBoardViewSubmissions(board.id, view) : skipToken,
  });

  useRealtimeRooms(useMemo(() => templateIds.map((id) => toRealtimeRoom(RealtimeRoom.TEMPLATE, id)), [templateIds]));
  useRealtimeEvent<SubmissionValues>(RealtimeEvent.SUBMISSION_VALUES, (values) => {
    if (!templateIds.includes(values.templateVersion.templateId)) return;
    if (isTask) {
      void invalidate();
      return;
    }
    queryClient.setQueryData<PaginatedResponse<Submission>>(queryKey, (page) =>
      page && { ...page, items: page.items.map((item) => (item.id === values.id ? { ...item, ...values } : item)) },
    );
  });

  const addMutation = useMutation({
    mutationFn: (templateId: string) => createSubmission(templateId),
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
