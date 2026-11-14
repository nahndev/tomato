"use client";

import { UserFilePicker } from "@/modules/file";
import { StorageFileList } from "@tomato/storage-ui";
import type { StorageFile } from "@tomato/storage-ui";
import { Button, Typography } from "@tomato/ui";
import { ImagePlusIcon } from "lucide-react";
import { IMAGE_UPLOADER_PICKER_OPTIONS } from "../../../template-widget.constants";
import type { FieldComponentProps } from "../../../template-widget.types";

export function ImageUploaderWidgetItem({ widget, value, onChange }: FieldComponentProps<string | undefined>) {
  const fileId = typeof value === "string" && value ? value : undefined;

  async function handleConfirm([file]: StorageFile[]) {
    if (file) onChange?.(file.id);
  }

  if (fileId) {
    return <StorageFileList ids={[fileId]} onRemove={onChange && (() => onChange(undefined))} />;
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
