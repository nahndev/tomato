"use client";

import { Canvas, type CanvasValue } from "@tomato/canvas";
import { Spinner, Toaster, toast } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useMap } from "../hooks/use-map";
import { fromCanvasValue, shouldSaveNow, toCanvasValue } from "../map.utils";
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
  const storedValue = map.value;

  function handleChangeValue(next: CanvasValue) {
    const value = fromCanvasValue(next);
    if (!shouldSaveNow(storedValue, value)) {
      changeValue(() => value);
      return;
    }
    saveValue(() => value).catch(() => toast.error("Could not save the map"));
  }

  return (
    <div className="h-screen bg-canvas">
      <Canvas
        value={toCanvasValue(map.value, map.name)}
        onChangeValue={handleChangeValue}
        leading={<MapLeading map={map} />}
        extension={<MapExtension departmentId={map.departmentId} />}
      />
      <Toaster />
    </div>
  );
}
