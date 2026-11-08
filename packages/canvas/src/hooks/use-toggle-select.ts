import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { DRAG_THRESHOLD } from "../canvas.constants";
import type { Point } from "../canvas.types";
import { useCanvas } from "../components/state-provider";
import { getClientPoint, getDistance } from "../utils/transform.utils";

interface UseToggleSelectOptions {
  id: string;
  isSelectable?: boolean;
}

/** Selects on press; a click without a drag on the selected layer clears the selection. */
export function useToggleSelect({ id, isSelectable = true }: UseToggleSelectOptions) {
  const isSelected = useCanvas((state) => state.selectedLayerId === id);
  const selectLayer = useCanvas((state) => state.selectLayer);
  const pressRef = useRef<Point | null>(null);

  return {
    isSelected,
    onPointerDown: (event: ReactPointerEvent) => {
      if (!isSelectable || event.button !== 0) return;
      pressRef.current = isSelected ? getClientPoint(event) : null;
      if (!isSelected) selectLayer(id);
    },
    onClick: (event: ReactMouseEvent) => {
      const press = pressRef.current;
      pressRef.current = null;
      if (press && getDistance(press, getClientPoint(event)) < DRAG_THRESHOLD)
        selectLayer(null);
    },
  };
}
