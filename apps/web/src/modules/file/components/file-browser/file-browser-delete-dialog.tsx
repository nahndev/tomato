"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tomato/ui";
import type { FileBrowserItem, FileBrowserLabels } from "../../file.types";

interface FileBrowserDeleteDialogProps {
  item: FileBrowserItem | null;
  labels: FileBrowserLabels;
  onCancel: () => void;
  onConfirm: (item: FileBrowserItem) => void;
}

export function FileBrowserDeleteDialog({
  item,
  labels,
  onCancel,
  onConfirm,
}: FileBrowserDeleteDialogProps) {
  return (
    <AlertDialog
      open={Boolean(item)}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {item?.name} · {labels.deleteDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (item) onConfirm(item);
            }}
          >
            {labels.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
