import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";
import { createContext, useContext, type ReactNode } from "react";
import { DRAG_ACTIVATOR_ATTRIBUTE } from "../../storage.constants";
import type { FileBrowserItem } from "../../storage.types";
import { findMove } from "../../utils/file-browser.utils";

const DRAG_SENSORS = [
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

const DragItemsContext = createContext<FileBrowserItem[]>([]);

export const useDragItems = () => useContext(DragItemsContext);

interface FileBrowserDragProviderProps {
  items: FileBrowserItem[];
  onMove: (item: FileBrowserItem, parentId: string | null) => void;
  children: ReactNode;
}

export function FileBrowserDragProvider({
  items,
  onMove,
  children,
}: FileBrowserDragProviderProps) {
  return (
    <DragItemsContext.Provider value={items}>
      <DragDropProvider
        sensors={DRAG_SENSORS}
        onDragEnd={({ operation: { source, target }, canceled }) => {
          if (canceled || !source || !target) return;
          const move = findMove(items, source.id, target.id);
          if (move) onMove(move.item, move.parentId);
        }}
      >
        {children}
      </DragDropProvider>
    </DragItemsContext.Provider>
  );
}
