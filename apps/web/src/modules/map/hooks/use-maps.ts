"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapKeys } from "../map.keys";
import type { MapInput } from "../map.schemas";
import {
  createMap,
  deleteMap,
  listMaps,
  updateMap,
} from "../services/maps.service";

export function useMaps() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: mapKeys.list });

  const { data, isLoading, isError } = useQuery({
    queryKey: mapKeys.list,
    queryFn: listMaps,
  });

  const addMutation = useMutation({
    mutationFn: createMap,
    onSuccess: invalidate,
  });
  const renameMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: MapInput }) =>
      updateMap(id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: deleteMap,
    onSuccess: invalidate,
  });

  return {
    maps: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: MapInput) => {
      await addMutation.mutateAsync(input);
    },
    rename: async (id: string, input: MapInput) => {
      await renameMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
