"use client";

import { Button } from "@tomato/ui";
import { XIcon } from "lucide-react";
import type { FieldComponentProps } from "../../../template-editor.types";

export interface UploadedImage {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

/** Kept client-side as a data URL until an upload endpoint exists. */
export function ImageUploaderWidgetItem({ widget, value, onChange }: FieldComponentProps<UploadedImage | undefined>) {
  function handleSelect(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange?.({ name: file.name, size: file.size, type: file.type, dataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  if (value?.dataUrl) {
    return (
      <div className="mt-2 flex items-center gap-3">
        <img src={value.dataUrl} alt={value.name} className="size-16 rounded-md border border-input object-cover" />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{value.name}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange?.(undefined)}>
            <XIcon />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <input
      id={widget.id}
      type="file"
      accept="image/*"
      onChange={(event) => handleSelect(event.target.files?.[0])}
      className="mt-2 block w-full text-sm text-muted-foreground"
    />
  );
}
