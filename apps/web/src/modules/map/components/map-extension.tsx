"use client";

import { getFileContentUrl, UserFilePicker } from "@/modules/file";
import { ToolbarButton, useAddImage } from "@tomato/canvas";
import { ImagePlusIcon } from "lucide-react";
import { MAP_IMAGE_PICKER_OPTIONS } from "../map.constants";
import type { StorageFile } from "@tomato/storage-ui";

export function MapExtension() {
  const addImage = useAddImage();

  async function handleConfirm([file]: StorageFile[]) {
    if (file) await addImage(getFileContentUrl(file.id));
  }

  return (
    <UserFilePicker
      options={{
        ...MAP_IMAGE_PICKER_OPTIONS,
        title: "Choose map image",
        confirmFailedMessage: "Could not use the image",
      }}
      onConfirm={handleConfirm}
    >
      <ToolbarButton label="Add image">
        <ImagePlusIcon />
      </ToolbarButton>
    </UserFilePicker>
  );
}
