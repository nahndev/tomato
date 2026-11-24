"use client";

import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoardView, RealtimeEvent, RealtimeRoom } from "@tomato/constants";
import { buildRealtimeRoom } from "@tomato/protocol";
import { useMemo } from "react";
import type { PaginatedResponse } from "@/shared/types/api.types";
import { useRealtimeEvent, useRealtimeRooms } from "@/shared/lib/realtime";
import { boardKeys } from "../board.keys";
import type { Board, BoardAgendaRange, Submission, SubmissionValues, TaskChanges } from "../board.types";
import {
  createSubmission,
  deleteSubmission,
  listBoardViewSubmissions,
  updateTask,
} from "../services/board-submissions.service";

export function useBoardSubmissions(board: Board, view: BoardView | undefined, range?: BoardAgendaRange) {
  const queryClient = useQueryClient();
  const templateIds = useMemo(() => board.templates.map((template) => template.templateId), [board.templates]);
  const isFiltered = view !== BoardView.TABLE;
  const queryKey = boardKeys.viewSubmissions(board.id, templateIds, view, range);
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: view && templateIds.length > 0 ? () => listBoardViewSubmissions(board.id, view, range) : skipToken,
    placeholderData: (previous, previousQuery) => (range && previousQuery?.queryKey[4] === view ? previous : undefined),
  });

  useRealtimeRooms(useMemo(() => templateIds.map((id) => buildRealtimeRoom(RealtimeRoom.TEMPLATE, id)), [templateIds]));
  useRealtimeEvent<SubmissionValues>(RealtimeEvent.SUBMISSION_VALUES, (values) => {
    if (!templateIds.includes(values.templateVersion.templateId)) return;
    if (isFiltered) {
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
  const updateMutation = useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: TaskChanges }) => updateTask(board.id, id, changes),
    onSuccess: invalidate,
  });

  return {
    submissions: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (templateId: string) => addMutation.mutateAsync(templateId),
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
    update: async (id: string, changes: TaskChanges) => updateMutation.mutateAsync({ id, changes }),
  };
}
