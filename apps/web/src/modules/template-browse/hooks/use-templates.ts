"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTemplate, deleteTemplate, listTemplates } from "../services/templates.service";
import { templateKeys } from "../template-browse.keys";
import type { CreateTemplateInput } from "../template-browse.schemas";

export function useTemplates() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: templateKeys.all });

  const { data, isLoading, isError } = useQuery({
    queryKey: templateKeys.all,
    queryFn: listTemplates,
  });

  const addMutation = useMutation({
    mutationFn: (input: CreateTemplateInput) => createTemplate(input),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: invalidate,
  });

  return {
    templates: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: CreateTemplateInput) => {
      await addMutation.mutateAsync(input);
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
