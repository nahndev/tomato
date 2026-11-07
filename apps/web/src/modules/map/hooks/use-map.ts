"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DepartmentMap, DepartmentMapDetail, MapPin } from "@tomato/types";
import { mapKeys } from "../map.keys";
import type {
  MapInput,
  MapPinCreateInput,
  MapPinUpdateInput,
} from "../map.schemas";
import {
  createMapPin,
  deleteMapPin,
  getMap,
  setMapImage,
  updateMap,
  updateMapPin,
} from "../services/maps.service";

export function useMap(id: string) {
  const queryClient = useQueryClient();
  const queryKey = mapKeys.detail(id);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => getMap(id),
  });

  function patchCache(
    update: (map: DepartmentMapDetail) => DepartmentMapDetail,
  ) {
    queryClient.setQueryData<DepartmentMapDetail>(queryKey, (map) =>
      map ? update(map) : map,
    );
  }

  function applyMap(map: DepartmentMap) {
    patchCache((current) => ({ ...current, ...map }));
    void queryClient.invalidateQueries({
      queryKey: mapKeys.all(map.departmentId),
    });
  }

  function replacePin(pin: MapPin) {
    patchCache((map) => ({
      ...map,
      pins: map.pins.map((current) => (current.id === pin.id ? pin : current)),
    }));
  }

  const renameMutation = useMutation({
    mutationFn: (input: MapInput) => updateMap(id, input),
    onSuccess: applyMap,
  });
  const setImageMutation = useMutation({
    mutationFn: (fileId: string) => setMapImage(id, fileId),
    onSuccess: applyMap,
  });
  const addPinMutation = useMutation({
    mutationFn: (input: MapPinCreateInput) => createMapPin(id, input),
    onSuccess: (pin) =>
      patchCache((map) => ({ ...map, pins: [...map.pins, pin] })),
  });
  const updatePinMutation = useMutation({
    mutationFn: ({
      pinId,
      input,
    }: {
      pinId: string;
      input: MapPinUpdateInput;
    }) => updateMapPin(id, pinId, input),
    onMutate: async ({ pinId, input }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<DepartmentMapDetail>(queryKey);
      patchCache((map) => ({
        ...map,
        pins: map.pins.map((pin) =>
          pin.id === pinId ? { ...pin, ...input } : pin,
        ),
      }));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: replacePin,
  });
  const removePinMutation = useMutation({
    mutationFn: (pinId: string) => deleteMapPin(id, pinId),
    onSuccess: (_data, pinId) =>
      patchCache((map) => ({
        ...map,
        pins: map.pins.filter((pin) => pin.id !== pinId),
      })),
  });

  return {
    map: data,
    isLoading,
    hasError: isError,
    rename: async (input: MapInput) => {
      await renameMutation.mutateAsync(input);
    },
    setImage: async (fileId: string) => {
      await setImageMutation.mutateAsync(fileId);
    },
    addPin: (input: MapPinCreateInput) => addPinMutation.mutateAsync(input),
    updatePin: async (pinId: string, input: MapPinUpdateInput) => {
      await updatePinMutation.mutateAsync({ pinId, input });
    },
    removePin: async (pinId: string) => {
      await removePinMutation.mutateAsync(pinId);
    },
  };
}
