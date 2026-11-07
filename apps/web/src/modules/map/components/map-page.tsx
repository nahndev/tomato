"use client";

import { getFileContentUrl } from "@/modules/file";
import { ImageMap, type Point } from "@tomato/image-map";
import { Button, Spinner, toast, Toaster } from "@tomato/ui";
import { ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useMap } from "../hooks/use-map";
import type { MapPinInput } from "../map.schemas";
import { MapHeader } from "./map-header";
import { MapImagePicker } from "./map-image-picker";
import { MapPinPanel } from "./map-pin-panel";

export function MapPage({ mapId }: { mapId: string }) {
  const { map, isLoading, hasError, setImage, addPin, updatePin, removePin } = useMap(mapId);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isAddingPin, setIsAddingPin] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  if (hasError || !map) notFound();

  async function handleAddPin(point: Point) {
    setIsAddingPin(false);
    try {
      const pin = await addPin({ label: `Pin ${(map?.pins.length ?? 0) + 1}`, description: "", ...point });
      setSelectedPinId(pin.id);
    } catch {
      toast.error("Could not add the pin");
    }
  }

  async function handleMovePin(id: string, point: Point) {
    try {
      await updatePin(id, point);
    } catch {
      toast.error("Could not move the pin");
    }
  }

  async function handleSavePin(id: string, input: MapPinInput) {
    await updatePin(id, input);
  }

  async function handleDeletePin(id: string) {
    await removePin(id);
    if (id === selectedPinId) setSelectedPinId(null);
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-canvas">
      <MapHeader
        map={map}
        isAddingPin={isAddingPin}
        onToggleAddingPin={() => setIsAddingPin((current) => !current)}
        onPickImage={setImage}
      />
      <div className="flex min-h-0">
        {map.imageFileId ? (
          <ImageMap
            src={getFileContentUrl(map.imageFileId)}
            alt={map.name}
            pins={map.pins}
            selectedPinId={selectedPinId}
            isAddingPin={isAddingPin}
            onSelectPin={setSelectedPinId}
            onAddPin={handleAddPin}
            onMovePin={handleMovePin}
            className="min-w-0 flex-1"
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ImageIcon className="size-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">This map has no image yet.</p>
            <MapImagePicker departmentId={map.departmentId} onPick={setImage}>
              <Button>Choose image</Button>
            </MapImagePicker>
          </div>
        )}
        <MapPinPanel
          pins={map.pins}
          selectedPinId={selectedPinId}
          onSelect={setSelectedPinId}
          onSave={handleSavePin}
          onDelete={handleDeletePin}
        />
      </div>
      <Toaster />
    </div>
  );
}
