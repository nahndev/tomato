"use client";

import { getDepartmentHref } from "@/modules/department";
import type { DepartmentMap } from "@tomato/types";
import { Button } from "@tomato/ui";
import { ArrowLeftIcon, ImageIcon, MapPinPlusIcon } from "lucide-react";
import Link from "next/link";
import { MapImagePicker } from "./map-image-picker";

interface MapHeaderProps {
  map: DepartmentMap;
  isAddingPin: boolean;
  onToggleAddingPin: () => void;
  onPickImage: (fileId: string) => Promise<void>;
}

export function MapHeader({ map, isAddingPin, onToggleAddingPin, onPickImage }: MapHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground">
      <Button asChild variant="ghost" size="icon" aria-label="Back to maps">
        <Link href={`${getDepartmentHref(map.departmentId)}/maps`}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className="truncate font-medium">{map.name}</h1>
      <div className="flex-1" />
      {map.imageFileId && (
        <Button
          variant={isAddingPin ? "default" : "outline"}
          size="sm"
          aria-pressed={isAddingPin}
          onClick={onToggleAddingPin}
        >
          <MapPinPlusIcon />
          {isAddingPin ? "Click the map to place" : "Add pin"}
        </Button>
      )}
      <MapImagePicker departmentId={map.departmentId} onPick={onPickImage}>
        <Button variant="outline" size="sm">
          <ImageIcon />
          {map.imageFileId ? "Change image" : "Choose image"}
        </Button>
      </MapImagePicker>
    </header>
  );
}
