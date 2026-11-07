import { CollisionPriority } from "@dnd-kit/abstract";
import { pointerIntersection } from "@dnd-kit/collision";
import { useDroppable } from "@dnd-kit/react";
import { cn } from "@tomato/ui";
import type { ReactNode } from "react";
import { DROP_TARGET_CLASS, ROOT_DROP_TARGET_ID } from "../../storage.constants";

interface TreeDropZoneProps {
  canDrop: boolean;
  className?: string;
  children: ReactNode;
}

export function TreeDropZone({ canDrop, className, children }: TreeDropZoneProps) {
  const { ref, isDropTarget } = useDroppable({
    id: ROOT_DROP_TARGET_ID,
    collisionDetector: pointerIntersection,
    // Lets the folders inside win over the root.
    collisionPriority: CollisionPriority.Lowest,
  });

  return (
    <div
      ref={ref}
      className={cn(className, canDrop && isDropTarget && DROP_TARGET_CLASS)}
    >
      {children}
    </div>
  );
}
