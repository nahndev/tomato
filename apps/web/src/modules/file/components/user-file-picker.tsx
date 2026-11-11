"use client";

import { FileBrowser, type FileBrowserOptions } from "@tomato/storage-ui";
import type { StorageGroupLimit } from "@tomato/storage-ui";
import type { StorageFile } from "@tomato/storage-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast,
} from "@tomato/ui";
import { useState, type ReactNode } from "react";
import { UserFilePickerLabel } from "../file.constants";

export interface UserFilePickerOptions extends FileBrowserOptions {
  title?: string;
  confirmLabel?: string;
  confirmFailedMessage?: string;
}

interface UserFilePickerProps {
  limit?: StorageGroupLimit | null;
  options?: UserFilePickerOptions;
  onConfirm: (files: StorageFile[]) => Promise<void>;
  children: ReactNode;
}

export function UserFilePicker({
  limit,
  options = {},
  onConfirm,
  children,
}: UserFilePickerProps) {
  const {
    title = UserFilePickerLabel.TITLE,
    confirmLabel = UserFilePickerLabel.CONFIRM,
    confirmFailedMessage = UserFilePickerLabel.CONFIRM_FAILED,
    ...browserOptions
  } = options;
  const [isOpen, setIsOpen] = useState(false);

  async function handleChangeValue(files: StorageFile[]) {
    try {
      await onConfirm(files);
      setIsOpen(false);
    } catch {
      // A toast stays visible if the dialog was closed meanwhile.
      toast.error(confirmFailedMessage);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="h-[min(36rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)] sm:max-w-5xl"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FileBrowser
          className="h-full"
          limit={limit}
          options={{ ...browserOptions, submit: confirmLabel }}
          onChangeValue={handleChangeValue}
        />
      </DialogContent>
    </Dialog>
  );
}
