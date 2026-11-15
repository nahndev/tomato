"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimeEvent, RealtimeRoom } from "@tomato/constants";
import { toRealtimeRoom } from "@tomato/utils";
import { useMemo } from "react";
import type { PaginatedResponse } from "@/shared/types/api.types";
import { useRealtimeEvent, useRealtimeRooms } from "@/shared/lib/realtime";
import { boardKeys } from "../board.keys";
import type { Board, Submission, SubmissionValues } from "../board.types";
import { createSubmission, deleteSubmission, listSubmissions } from "../services/board-submissions.service";

export function useBoardSubmissions(board: Board) {
  const queryClient = useQueryClient();
  const templateIds = useMemo(() => board.templates.map((template) => template.templateId), [board.templates]);
  const queryKey = boardKeys.submissions(board.id, templateIds);
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => listSubmissions(templateIds),
    enabled: templateIds.length > 0,
  });

  useRealtimeRooms(useMemo(() => templateIds.map((id) => toRealtimeRoom(RealtimeRoom.TEMPLATE, id)), [templateIds]));
  useRealtimeEvent<SubmissionValues>(RealtimeEvent.SUBMISSION_VALUES, (values) => {
    if (!templateIds.includes(values.templateVersion.templateId)) return;
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
