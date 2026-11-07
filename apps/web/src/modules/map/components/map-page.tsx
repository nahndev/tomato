"use client";

import { ImageMap, type ImageMapValue } from "@tomato/image-map";
import { Spinner, Toaster, toast } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useMap } from "../hooks/use-map";
import { MAP_FRAME_SIZE } from "../map.constants";
import {
  fromImageMapLayers,
  isLayerListChange,
  toImageMapLayers,
} from "../map.utils";
import { MapExtension } from "./map-extension";
import { MapLeading } from "./map-leading";

export function MapPage({ mapId }: { mapId: string }) {
  const { map, isLoading, hasError, changeValue, saveValue } = useMap(mapId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  if (hasError || !map) notFound();
  const storedLayers = map.value.layers;

  function handleChangeValue({ layers, viewport }: ImageMapValue) {
    const value = { layers: fromImageMapLayers(layers), viewport };
    if (!isLayerListChange(storedLayers, value.layers)) {
      changeValue(() => value);
      return;
    }
    saveValue(() => value).catch(() => toast.error("Could not save the map"));
  }

  return (
    <div className="h-screen bg-canvas">
      <ImageMap
        value={{
          frame: MAP_FRAME_SIZE,
          layers: toImageMapLayers(map.value.layers, map.name),
          viewport: map.value.viewport,
        }}
        onChangeValue={handleChangeValue}
        leading={<MapLeading map={map} />}
        extension={<MapExtension departmentId={map.departmentId} />}
      />
      <Toaster />
    </div>
  );
}
