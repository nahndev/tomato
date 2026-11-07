"use client";

import { MapLayerType } from "@tomato/constants";
import {
  DEFAULT_VIEWPORT,
  ImageMap,
  type ImageMapValue,
} from "@tomato/image-map";
import { Spinner, Toaster, toast } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useMap } from "../hooks/use-map";
import { MAP_FRAME_SIZE } from "../map.constants";
import type { MapPinInput } from "../map.schemas";
import {
  createImageLayer,
  fromImageMapLayers,
  getPins,
  toImageMapLayers,
} from "../map.utils";
import { MapHeader } from "./map-header";
import { MapPinPanel } from "./map-pin-panel";

export function MapPage({ mapId }: { mapId: string }) {
  const { map, isLoading, hasError, changeValue, saveValue } = useMap(mapId);
  const [selectedLayerId, setSelectedLayerId] = useState(
    DEFAULT_VIEWPORT.selectedLayerId,
  );
  const [isAddingPin, setIsAddingPin] = useState(DEFAULT_VIEWPORT.isAddingPin);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  if (hasError || !map) notFound();

  const pins = getPins(map.value);
  const isImageSelected = map.value.layers.some(
    (layer) =>
      layer.id === selectedLayerId && layer.type === MapLayerType.IMAGE,
  );

  function handleChangeValue({ layers, viewport }: ImageMapValue) {
    setSelectedLayerId(viewport.selectedLayerId);
    setIsAddingPin(viewport.isAddingPin);
    changeValue((value) => ({
      layers: fromImageMapLayers(layers, value.layers),
      viewport: { transform: viewport.transform },
    }));
  }

  async function handleAddImage(fileId: string) {
    const image = await createImageLayer(fileId);
    await saveValue((value) => ({
      ...value,
      layers: [...value.layers, image],
    }));
    setSelectedLayerId(image.id);
  }

  async function removeLayer(id: string) {
    await saveValue((value) => ({
      ...value,
      layers: value.layers.filter((layer) => layer.id !== id),
    }));
    if (id === selectedLayerId) setSelectedLayerId(null);
  }

  function handleDeleteImage() {
    if (selectedLayerId)
      removeLayer(selectedLayerId).catch(() =>
        toast.error("Could not delete the image"),
      );
  }

  async function handleSavePin(id: string, input: MapPinInput) {
    await saveValue((value) => ({
      ...value,
      layers: value.layers.map((layer) =>
        layer.id === id ? { ...layer, ...input } : layer,
      ),
    }));
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-canvas">
      <MapHeader
        map={map}
        isAddingPin={isAddingPin}
        onAddImage={handleAddImage}
        onDeleteImage={isImageSelected ? handleDeleteImage : undefined}
        onToggleAddingPin={() => setIsAddingPin((current) => !current)}
      />
      <div className="flex flex-row">
        <ImageMap
          value={{
            frame: MAP_FRAME_SIZE,
            layers: toImageMapLayers(map.value.layers, map.name),
            viewport: {
              transform: map.value.viewport.transform,
              selectedLayerId,
              isAddingPin,
            },
          }}
          onChangeValue={handleChangeValue}
          className="min-w-0"
        />
        <MapPinPanel
          pins={pins}
          selectedPinId={selectedLayerId}
          onSelect={setSelectedLayerId}
          onSave={handleSavePin}
          onDelete={removeLayer}
        />
      </div>
      <Toaster />
    </div>
  );
}
