import { useState, type DragEvent } from "react";
import type { FileBrowserItem } from "../storage.types";
import { canMoveTo } from "../utils/file-browser.utils";

export interface FileBrowserDropTargetProps {
  onDragOver: (event: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent) => void;
}

export function useFileBrowserDrag(
  items: FileBrowserItem[],
  onMove: (item: FileBrowserItem, targetId: string | null) => void,
) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // `null` is the root folder; `undefined` means no target.
  const [dropTargetId, setDropTargetId] = useState<string | null>();
  const draggingItem = items.find((item) => item.id === draggingId);

  function getDropTargetProps(
    targetId: string | null,
  ): FileBrowserDropTargetProps {
    const movingItem =
      draggingItem && canMoveTo(items, draggingItem, targetId)
        ? draggingItem
        : null;

    return {
      onDragOver: (event) => {
        if (!movingItem) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDropTargetId(targetId);
      },
      onDragLeave: () => {
        setDropTargetId((current) =>
          current === targetId ? undefined : current,
        );
      },
      onDrop: (event) => {
        if (!movingItem) return;
        event.preventDefault();
        event.stopPropagation();
        setDropTargetId(undefined);
        setDraggingId(null);
        onMove(movingItem, targetId);
      },
    };
  }

  function getDragSourceProps(item: FileBrowserItem) {
    return {
      onDragStart: (event: DragEvent) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.name);
        setDraggingId(item.id);
      },
      onDragEnd: () => {
        setDraggingId(null);
        setDropTargetId(undefined);
      },
    };
  }

  return { draggingId, dropTargetId, getDropTargetProps, getDragSourceProps };
}
