import { useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { DRAG_THRESHOLD } from "../canvas.constants";
import type { Point } from "../canvas.types";
import { getClientPoint, getDistance } from "../utils/transform.utils";

interface UseToggleSelectOptions {
  id: string;
  isSelected: boolean;
  onSelect?: (id: string | null) => void;
}

/** Selects on press; a click without a drag on the selected layer clears the selection. */
export function useToggleSelect({ id, isSelected, onSelect }: UseToggleSelectOptions) {
  const pressRef = useRef<Point | null>(null);

  return {
    onPointerDown: (event: ReactPointerEvent) => {
      if (!onSelect || event.button !== 0) return;
      pressRef.current = isSelected ? getClientPoint(event) : null;
      if (!isSelected) onSelect(id);
    },
    onClick: (event: ReactMouseEvent) => {
      const press = pressRef.current;
      pressRef.current = null;
      if (press && getDistance(press, getClientPoint(event)) < DRAG_THRESHOLD) onSelect?.(null);
    },
  };
}
