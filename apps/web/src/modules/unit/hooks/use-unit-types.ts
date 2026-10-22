"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unitKeys } from "../unit.keys";
import type { UnitTypeInput } from "../unit.schemas";
import { createUnitType, deleteUnitType, listUnitTypes, updateUnitType } from "../services/unit-types.service";

export function useUnitTypes() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: unitKeys.types });
    void queryClient.invalidateQueries({ queryKey: unitKeys.all });
  };

  const { data, isLoading, isError } = useQuery({ queryKey: unitKeys.types, queryFn: listUnitTypes });

  const addMutation = useMutation({ mutationFn: (input: UnitTypeInput) => createUnitType(input), onSuccess: invalidate });
  const editMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UnitTypeInput }) => updateUnitType(id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({ mutationFn: (id: string) => deleteUnitType(id), onSuccess: invalidate });

  return {
    types: data ?? [],
    isLoading,
    hasError: isError,
    add: async (input: UnitTypeInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: UnitTypeInput) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
