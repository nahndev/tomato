"use client";

import { getFileContentUrl, UserFilePicker } from "@/modules/file";
import { GroupType } from "@tomato/constants";
import { ToolbarButton, useAddImage } from "@tomato/canvas";
import type { StorageFile } from "@tomato/types";
import { ImagePlusIcon } from "lucide-react";
import { MAP_IMAGE_PICKER_OPTIONS } from "../map.constants";

/** Extra toolbar actions of the map page; rendered inside `Canvas`. */
export function MapExtension({ departmentId }: { departmentId: string }) {
  const addImage = useAddImage();

  async function handleConfirm([file]: StorageFile[]) {
    if (file) await addImage(getFileContentUrl(file.id));
  }

  return (
    <UserFilePicker
      limit={{ type: GroupType.DEPARTMENT, uuid: departmentId }}
      options={MAP_IMAGE_PICKER_OPTIONS}
      onConfirm={handleConfirm}
    >
      <ToolbarButton label="Add image">
        <ImagePlusIcon />
      </ToolbarButton>
    </UserFilePicker>
  );
}
