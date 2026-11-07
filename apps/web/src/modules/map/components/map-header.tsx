"use client";

import { getDepartmentHref } from "@/modules/department";
import type { DepartmentMap } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { ArrowLeftIcon, ImagePlusIcon, MapPinPlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { MapImagePicker } from "./map-image-picker";

interface MapHeaderProps {
  map: DepartmentMap;
  isAddingPin: boolean;
  /** Set while an image is selected. */
  onDeleteImage?: () => void;
  onAddImage: (fileId: string) => Promise<void>;
  onToggleAddingPin: () => void;
}

export function MapHeader({ map, isAddingPin, onDeleteImage, onAddImage, onToggleAddingPin }: MapHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground">
      <Button asChild variant="ghost" size="icon" aria-label="Back to maps">
        <Link href={`${getDepartmentHref(map.departmentId)}/maps`}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className="truncate font-medium">{map.name}</h1>
      <div className="flex-1" />
      {onDeleteImage && (
        <ConfirmDialog
          title="Delete image?"
          description="The image is removed from this map."
          destructive="Delete"
          onDestructive={onDeleteImage}
        >
          <Button variant="outline" size="sm">
            <Trash2Icon />
            Delete image
          </Button>
        </ConfirmDialog>
      )}
      <MapImagePicker departmentId={map.departmentId} onPick={onAddImage}>
        <Button variant="outline" size="sm">
          <ImagePlusIcon />
          Add image
        </Button>
      </MapImagePicker>
      <Button
        variant={isAddingPin ? "default" : "outline"}
        size="sm"
        aria-pressed={isAddingPin}
        onClick={onToggleAddingPin}
      >
        <MapPinPlusIcon />
        {isAddingPin ? "Click the map to place" : "Add pin"}
      </Button>
    </header>
  );
}
