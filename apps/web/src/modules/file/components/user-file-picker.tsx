"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast,
} from "@tomato/ui";
import {
  FileBrowser,
  FileBrowserChangeType,
  FileBrowserItemType,
  type FileBrowserChange,
  type FileBrowserItem,
  type FileBrowserOptions,
} from "@tomato/ui/client";
import { generateId } from "@tomato/utils";
import { useState, type ReactNode } from "react";
import { UserFilePickerLabel } from "../file.constants";

interface UserFileItem extends FileBrowserItem {
  file?: File;
}

function getDescendantIds(items: UserFileItem[], folderId: string): string[] {
  return items
    .filter((item) => item.parentId === folderId)
    .flatMap((item) => [item.id, ...getDescendantIds(items, item.id)]);
}

interface UserFilePickerOptions extends FileBrowserOptions {
  title?: string;
  confirmLabel?: string;
  confirmFailedMessage?: string;
}

interface UserFilePickerProps {
  options?: UserFilePickerOptions;
  onConfirm: (files: File[]) => Promise<void>;
  /** The dialog trigger. */
  children: ReactNode;
}

/** No storage API yet: only `onConfirm` persists, the list lives in state. */
export function UserFilePicker({
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
  const [items, setItems] = useState<UserFileItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedFiles = items.flatMap(({ id, file }) =>
    file && selectedIds.includes(id) ? [file] : [],
  );

  function handleOpenChange(isNextOpen: boolean) {
    setIsOpen(isNextOpen);
    if (!isNextOpen) setSelectedIds([]);
  }

  function patchItem(id: string, patch: Partial<UserFileItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function applyChange({ type, payload }: FileBrowserChange) {
    switch (type) {
      case FileBrowserChangeType.UPLOAD_FILE: {
        const { file, parentId } = payload;
        setItems((current) => [
          ...current,
          {
            id: generateId(),
            name: file.name,
            parentId,
            type: FileBrowserItemType.FILE,
            size: file.size,
            mimeType: file.type,
            file,
          },
        ]);
        return;
      }
      case FileBrowserChangeType.CREATE_FOLDER: {
        const { name, parentId } = payload;
        setItems((current) => [
          ...current,
          {
            id: generateId(),
            name,
            parentId,
            type: FileBrowserItemType.FOLDER,
          },
        ]);
        return;
      }
      case FileBrowserChangeType.RENAME:
        patchItem(payload.item.id, { name: payload.name });
        return;
      case FileBrowserChangeType.MOVE:
        patchItem(payload.item.id, { parentId: payload.parentId });
        return;
      case FileBrowserChangeType.DELETE:
        setItems((current) => {
          const removedIds = new Set([
            payload.item.id,
            ...getDescendantIds(current, payload.item.id),
          ]);
          return current.filter(({ id }) => !removedIds.has(id));
        });
    }
  }

  function handleItemsChange(changes: FileBrowserChange[]) {
    changes.forEach(applyChange);
  }

  async function handleConfirm() {
    setIsConfirming(true);
    try {
      await onConfirm(selectedFiles);
      handleOpenChange(false);
    } catch {
      // A toast stays visible if the dialog was closed meanwhile.
      toast.error(confirmFailedMessage);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="h-[min(32rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)]"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FileBrowser
          className="h-full"
          items={items}
          selected={selectedIds}
          options={browserOptions}
          onItemsChange={handleItemsChange}
          onSelect={setSelectedIds}
        />
        <DialogFooter>
          <Button
            type="button"
            disabled={selectedFiles.length === 0 || isConfirming}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { UserFilePickerOptions };
