import { DragOverlay } from "@dnd-kit/react";
import { PIN_DND_TYPE } from "../canvas.constants";
import { PinMarker } from "./pin-marker";
import type { PinDragData } from "../canvas.types";

/** Drawn outside the zoomed content, so the dragged pin keeps its screen size. */
export function PinDragOverlay() {
  // No drop animation: the pin is moved on drop, so it has no slot to return to.
  // Enabled while idle, so it is already registered when a pin drag starts.
  return (
    <DragOverlay
      dropAnimation={null}
      disabled={(source) => Boolean(source) && source?.type !== PIN_DND_TYPE}
    >
      {(source) => {
        const { pin, isSelected } = source.data as PinDragData;
        return <PinMarker pin={pin} isSelected={isSelected} />;
      }}
    </DragOverlay>
  );
}
