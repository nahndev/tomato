import {
  KeyboardSensor,
  PointerSensor,
  type DragDropProvider,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { useState, type ComponentProps } from "react";
import {
  DRAG_ACTIVATOR_ATTRIBUTE,
  ROOT_DROP_TARGET_ID,
} from "../storage.constants";
import type { FileBrowserItem } from "../storage.types";
import { canMoveTo } from "../utils/file-browser.utils";

type DragSensors = ComponentProps<typeof DragDropProvider>["sensors"];

interface FileBrowserDrag {
  canDropOn: (targetId: string | null) => boolean;
  dragDropProps: {
    sensors: DragSensors;
    onDragStart: (event: DragStartEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
  };
}

const DRAG_SENSORS: DragSensors = [
  PointerSensor.configure({
    // Drags start anywhere on the row, not only on its handle.
    activatorElements: (source) => (source.element ? [source.element] : []),
    preventActivation: ({ target }) => {
      if (!(target instanceof Element)) return false;
      const control = target.closest("button, a, input, label");
      return control ? !control.hasAttribute(DRAG_ACTIVATOR_ATTRIBUTE) : false;
    },
  }),
  KeyboardSensor,
];

export function useFileBrowserDrag(
  items: FileBrowserItem[],
  onMove: (item: FileBrowserItem, targetId: string | null) => void,
): FileBrowserDrag {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const draggingItem = items.find((item) => item.id === draggingId);

  function canDropOn(targetId: string | null) {
    return Boolean(draggingItem && canMoveTo(items, draggingItem, targetId));
  }

  function onDragStart({ operation: { source } }: DragStartEvent) {
    setDraggingId(source ? String(source.id) : null);
  }

  function onDragEnd({ operation: { source, target }, canceled }: DragEndEvent) {
    setDraggingId(null);
    if (canceled || !source || !target) return;

    const item = items.find(({ id }) => id === source.id);
    const targetId = target.id === ROOT_DROP_TARGET_ID ? null : String(target.id);
    if (item && canMoveTo(items, item, targetId)) onMove(item, targetId);
  }

  return {
    canDropOn,
    dragDropProps: { sensors: DRAG_SENSORS, onDragStart, onDragEnd },
  };
}
