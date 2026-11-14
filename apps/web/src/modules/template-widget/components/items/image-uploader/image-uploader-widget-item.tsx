"use client";

import { getFileContentUrl, UserFilePicker } from "@/modules/file";
import { Picture, StorageFileList } from "@tomato/storage-ui";
import type { StorageFile } from "@tomato/storage-ui";
import { Button, Typography } from "@tomato/ui";
import { ImageIcon, ImagePlusIcon } from "lucide-react";
import { IMAGE_UPLOADER_PICKER_OPTIONS } from "../../../template-widget.constants";
import type { FieldComponentProps } from "../../../template-widget.types";

export function ImageUploaderWidgetItem({ widget, value, onChange }: FieldComponentProps<string | undefined>) {
  const fileId = typeof value === "string" && value ? value : undefined;

  async function handleConfirm([file]: StorageFile[]) {
    if (file) onChange?.(file.id);
  }

  if (fileId) {
    return (
      <div className="flex flex-col gap-2">
        <Picture
          src={getFileContentUrl(fileId)}
          className="aspect-video w-full max-w-xs rounded-md border border-input"
          fallback={
            <span className="flex size-full items-center justify-center text-muted-foreground">
              <ImageIcon />
            </span>
          }
        />
        <StorageFileList ids={[fileId]} onRemove={onChange && (() => onChange(undefined))} />
      </div>
    );
  }

  return (
    <UserFilePicker
      options={{ ...IMAGE_UPLOADER_PICKER_OPTIONS, title: "Choose an image" }}
      onConfirm={handleConfirm}
    >
      <Button id={widget.id} type="button" variant="outline" size="sm" className="self-start" disabled={!onChange}>
        <ImagePlusIcon />
        <Typography>Choose image</Typography>
      </Button>
    </UserFilePicker>
  );
}
