"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unitKeys } from "../unit.keys";
import type { UnitInput } from "../unit.schemas";
import { createUnit, deleteUnit, listUnits, updateUnit } from "../services/units.service";

export function useUnits() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: unitKeys.all });

  const { data, isLoading, isError } = useQuery({ queryKey: unitKeys.all, queryFn: listUnits });

  const addMutation = useMutation({ mutationFn: (input: UnitInput) => createUnit(input), onSuccess: invalidate });
  const editMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<UnitInput> }) => updateUnit(id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({ mutationFn: (id: string) => deleteUnit(id), onSuccess: invalidate });

  return {
    units: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: UnitInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: Partial<UnitInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
