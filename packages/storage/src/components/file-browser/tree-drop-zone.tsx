import { CollisionPriority } from "@dnd-kit/abstract";
import { cn } from "@tomato/ui";
import type { ReactNode } from "react";
import { useFileBrowserDrop } from "../../hooks/use-file-browser-drop";
import {
  DROP_TARGET_CLASS,
  ROOT_DROP_TARGET_ID,
} from "../../storage.constants";

interface TreeDropZoneProps {
  className?: string;
  children: ReactNode;
}

export function TreeDropZone({ className, children }: TreeDropZoneProps) {
  const { ref, isDropTarget } = useFileBrowserDrop({
    id: ROOT_DROP_TARGET_ID,
    // Lets the folders inside win over the root.
    collisionPriority: CollisionPriority.Lowest,
  });

  return (
    <div ref={ref} className={cn(className, isDropTarget && DROP_TARGET_CLASS)}>
      {children}
    </div>
  );
}
