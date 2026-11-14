"use client";

import { UserFilePicker } from "@/modules/file";
import { StorageFileList } from "@tomato/storage-ui";
import type { StorageFile } from "@tomato/storage-ui";
import { Button } from "@tomato/ui";
import { PaperclipIcon } from "lucide-react";
import { FILE_UPLOADER_PICKER_OPTIONS, UploaderLabel } from "../../../template-widget.constants";
import type { FieldComponentProps } from "../../../template-widget.types";

export function FileUploaderWidgetItem({ widget, value, onChange }: FieldComponentProps<string[]>) {
  const fileIds = Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];

  async function handleConfirm(files: StorageFile[]) {
    const addedIds = files.map(({ id }) => id).filter((id) => !fileIds.includes(id));
    onChange?.([...fileIds, ...addedIds]);
  }

  return (
    <div className="flex flex-col gap-2">
      <StorageFileList
        ids={fileIds}
        onRemove={onChange && ((id) => onChange(fileIds.filter((fileId) => fileId !== id)))}
      />
      <UserFilePicker options={FILE_UPLOADER_PICKER_OPTIONS} onConfirm={handleConfirm}>
        <Button id={widget.id} type="button" variant="outline" size="sm" className="self-start" disabled={!onChange}>
          <PaperclipIcon />
          {UploaderLabel.ADD_FILES}
        </Button>
      </UserFilePicker>
    </div>
  );
}
