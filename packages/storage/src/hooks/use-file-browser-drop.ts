import type { CollisionPriority } from "@dnd-kit/abstract";
import { pointerIntersection } from "@dnd-kit/collision";
import { useDragOperation, useDroppable } from "@dnd-kit/react";
import { useDragItems } from "../components/file-browser/file-browser-drag-provider";
import { findMove } from "../utils/file-browser.utils";

interface FileBrowserDropInput {
  id: string;
  element?: Element | null;
  disabled?: boolean;
  collisionPriority?: CollisionPriority;
}

/** `isDropTarget` is true only when dropping here would move the dragged item. */
export function useFileBrowserDrop(input: FileBrowserDropInput) {
  const items = useDragItems();
  const { source } = useDragOperation();
  const { ref, isDropTarget } = useDroppable({
    ...input,
    collisionDetector: pointerIntersection,
  });

  return {
    ref,
    isDropTarget:
      isDropTarget && Boolean(source && findMove(items, source.id, input.id)),
  };
}
