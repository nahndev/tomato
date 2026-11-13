"use client";

import { PointerActivationConstraints } from "@dnd-kit/dom";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import type { ReactNode } from "react";
import { createStoreContext } from "@tomato/store-context";
import { TooltipProvider } from "@tomato/ui";
import { useValueActions, type ValueActions } from "../hooks/use-value-actions";
import { DRAG_THRESHOLD } from "../canvas.constants";
import { createCanvasState, type CanvasStore } from "../canvas.store";
import type { CanvasValue } from "../canvas.types";
import { PinDragOverlay } from "./pin-drag-overlay";

// No keyboard sensor: Enter and Space select pins. Touch drags start without a delay.
const DRAG_SENSORS = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: DRAG_THRESHOLD }),
    ],
  }),
];

export interface StateProviderProps {
  value: CanvasValue;
  onChangeValue?: (value: CanvasValue) => void;
}

interface ValueContextValue extends ValueActions {
  value: CanvasValue;
}

const CanvasStateStore = createStoreContext<object, CanvasStore>("CanvasState", { initState: createCanvasState });
const CanvasValueStore = createStoreContext<ValueContextValue>("CanvasValue");

export const useCanvasStore = CanvasStateStore.useStoreApi;

export function useCanvas<T>(selector: (state: CanvasStore) => T): T {
  return CanvasStateStore.useSelector(selector);
}

export function useCanvasValue(): ValueContextValue {
  return CanvasValueStore.useSelector();
}

function CanvasValueProvider({ value, onChangeValue, children }: StateProviderProps & { children: ReactNode }) {
  const actions = useValueActions(useCanvasStore(), value, onChangeValue);
  return (
    <CanvasValueStore.Provider {...actions} value={value}>
      {children}
    </CanvasValueStore.Provider>
  );
}

export function StateProvider({
  value,
  onChangeValue,
  children,
}: StateProviderProps & { children: ReactNode }) {
  return (
    <CanvasStateStore.Provider>
      <CanvasValueProvider value={value} onChangeValue={onChangeValue}>
        <TooltipProvider>
          <DragDropProvider sensors={DRAG_SENSORS}>
            {children}
            <PinDragOverlay />
          </DragDropProvider>
        </TooltipProvider>
      </CanvasValueProvider>
    </CanvasStateStore.Provider>
  );
}
