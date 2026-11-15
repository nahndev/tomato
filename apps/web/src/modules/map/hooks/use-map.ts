"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Map, MapValue } from "../map.types";
import { toast } from "@tomato/ui";
import { useEffect, useRef } from "react";
import { MAP_SAVE_DELAY } from "../map.constants";
import { mapKeys } from "../map.keys";
import type { MapInput } from "../map.schemas";
import { getMap, updateMap } from "../services/maps.service";

type ValueUpdate = (value: MapValue) => MapValue;

export function useMap(id: string) {
  const queryClient = useQueryClient();
  const queryKey = mapKeys.detail(id);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => getMap(id),
  });

  function patchCache(update: (map: Map) => Map) {
    queryClient.setQueryData<Map>(queryKey, (map) => (map ? update(map) : map));
  }

  function invalidateList() {
    void queryClient.invalidateQueries({ queryKey: mapKeys.list });
  }

  const renameMutation = useMutation({
    mutationFn: (input: MapInput) => updateMap(id, input),
    onSuccess: (map) => {
      patchCache((current) => ({ ...current, name: map.name, updatedAt: map.updatedAt }));
      invalidateList();
    },
  });
  const saveMutation = useMutation({
    mutationFn: (value: MapValue) => updateMap(id, { value }),
    onSuccess: invalidateList,
    onError: () => queryClient.invalidateQueries({ queryKey }),
  });

  function cancelScheduledSave() {
    if (!saveTimerRef.current) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
  }

  async function save() {
    cancelScheduledSave();
    const map = queryClient.getQueryData<Map>(queryKey);
    if (map) await saveMutation.mutateAsync(map.value);
  }

  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });

  useEffect(
    () => () => {
      if (saveTimerRef.current) saveRef.current().catch(() => toast.error("Could not save the map"));
    },
    [],
  );

  function applyValue(update: ValueUpdate) {
    patchCache((map) => ({ ...map, value: update(map.value) }));
  }

  return {
    map: data,
    isLoading,
    hasError: isError,
    rename: async (input: MapInput) => {
      await renameMutation.mutateAsync(input);
    },
    changeValue: (update: ValueUpdate) => {
      applyValue(update);
      cancelScheduledSave();
      saveTimerRef.current = setTimeout(() => {
        saveRef.current().catch(() => toast.error("Could not save the map"));
      }, MAP_SAVE_DELAY);
    },
    saveValue: async (update: ValueUpdate) => {
      applyValue(update);
      await save();
    },
  };
}
