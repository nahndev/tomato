"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "../documents.keys";
import type {
  DocumentInput,
  DocumentUpdateInput,
} from "../documents.schemas";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "../services/documents.service";

export function useDocuments(departmentId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: documentKeys.all(departmentId) });

  const { data, isLoading, isError } = useQuery({
    queryKey: documentKeys.all(departmentId),
    queryFn: () => listDocuments(departmentId),
  });

  const addMutation = useMutation({
    mutationFn: (input: DocumentInput) => createDocument(departmentId, input),
    onSuccess: invalidate,
  });
  const editMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<DocumentUpdateInput>;
    }) => updateDocument(departmentId, id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(departmentId, id),
    onSuccess: invalidate,
  });

  return {
    documents: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: DocumentInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: Partial<DocumentUpdateInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
