import { useDragDropMonitor, useDraggable } from "@dnd-kit/react";
import { useState } from "react";
import { useImageMap } from "../components/state-provider";
import { PIN_DND_TYPE } from "../image-map.constants";
import type { ImageMapPin, PinDragData, Point } from "../image-map.types";

interface UsePinDragOptions {
  pin: ImageMapPin;
  isSelected: boolean;
  /** The pin is draggable only when set. */
  onMove?: (id: string, point: Point) => void;
}

/** Returns the pin's position, which holds the drop point until `pin` catches up. */
export function usePinDrag({ pin, isSelected, onMove }: UsePinDragOptions) {
  const getRatioPoint = useImageMap((state) => state.getRatioPoint);
  // `onMove` may update `pin` a few frames after the drag ends.
  const [drop, setDrop] = useState<{ point: Point; from: Point } | null>(null);
  const isDropPending = drop !== null && drop.from.x === pin.x && drop.from.y === pin.y;
  if (drop && !isDropPending) setDrop(null);

  const { ref, isDragging } = useDraggable<PinDragData>({
    id: pin.id,
    type: PIN_DND_TYPE,
    data: { pin, isSelected },
    disabled: !onMove,
  });

  useDragDropMonitor({
    onDragEnd: ({ operation: { source, shape, position }, canceled }) => {
      if (source?.id !== pin.id || canceled) return;
      const overlay = shape?.current.boundingRectangle;
      const tip = overlay ? { x: overlay.left + overlay.width / 2, y: overlay.bottom } : position.current;
      const point = getRatioPoint(tip);
      setDrop({ point, from: { x: pin.x, y: pin.y } });
      onMove?.(pin.id, point);
    },
  });

  return { ref, isDragging, position: isDropPending ? drop.point : pin };
}
