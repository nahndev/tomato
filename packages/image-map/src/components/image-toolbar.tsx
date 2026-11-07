"use client";

import { Button, ConfirmDialog, cn } from "@tomato/ui";
import { MapPinPlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { ImageMapLayerType } from "../image-map.constants";
import { useImageMap, useMapValue } from "./state-provider";

interface ImageToolbarProps {
  /** Extra actions, placed before "Add pin". */
  extension?: ReactNode;
  className?: string;
}

/** Normal map actions: delete the selected image, add a pin. */
export function ImageToolbar({ extension, className }: ImageToolbarProps) {
  const { value, removeLayer } = useMapValue();
  const selectedLayerId = useImageMap((state) => state.selectedLayerId);
  const isAddingPin = useImageMap((state) => state.isAddingPin);
  const setIsAddingPin = useImageMap((state) => state.setIsAddingPin);
  const selectedImage = value.layers.find(
    (layer) => layer.id === selectedLayerId && layer.type === ImageMapLayerType.IMAGE,
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {selectedImage && (
        <ConfirmDialog
          title="Delete image?"
          description="The image is removed from this map."
          destructive="Delete"
          onDestructive={() => removeLayer(selectedImage.id)}
        >
          <Button variant="outline" size="sm">
            <Trash2Icon />
            Delete image
          </Button>
        </ConfirmDialog>
      )}
      {extension}
      <Button
        variant={isAddingPin ? "default" : "outline"}
        size="sm"
        aria-pressed={isAddingPin}
        onClick={() => setIsAddingPin(!isAddingPin)}
      >
        <MapPinPlusIcon />
        {isAddingPin ? "Click the map to place" : "Add pin"}
      </Button>
    </div>
  );
}
