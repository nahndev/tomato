"use client";

import { UserFilePicker } from "@/modules/file";
import { GroupType } from "@tomato/constants";
import type { StorageFile } from "@tomato/types";
import type { ReactNode } from "react";
import { MAP_IMAGE_PICKER_OPTIONS } from "../map.constants";

interface MapImagePickerProps {
  departmentId: string;
  onPick: (fileId: string) => Promise<void>;
  children: ReactNode;
}

export function MapImagePicker({ departmentId, onPick, children }: MapImagePickerProps) {
  async function handleConfirm([file]: StorageFile[]) {
    if (file) await onPick(file.id);
  }

  return (
    <UserFilePicker
      limit={{ type: GroupType.DEPARTMENT, uuid: departmentId }}
      options={MAP_IMAGE_PICKER_OPTIONS}
      onConfirm={handleConfirm}
    >
      {children}
    </UserFilePicker>
  );
}
