"use client";

import { PointerActivationConstraints } from "@dnd-kit/dom";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { useCanvasValue, type CanvasValueActions } from "../hooks/use-canvas-value";
import { DRAG_THRESHOLD } from "../canvas.constants";
import {
  createCanvasStore,
  type CanvasStore,
  type CanvasStoreApi,
} from "../canvas.store";
import type { CanvasValue } from "../canvas.types";
import { PinDragOverlay } from "./pin-drag-overlay";

class StateProviderMissingError extends Error {
  constructor() {
    super("@tomato/canvas hooks must be used inside <StateProvider>");
  }
}

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

interface ValueContextValue extends CanvasValueActions {
  value: CanvasValue;
}

const StoreContext = createContext<CanvasStoreApi | null>(null);
const ValueContext = createContext<ValueContextValue | null>(null);

/** Holds the view state (store) and the controlled value with its actions. */
export function StateProvider({
  value,
  onChangeValue,
  children,
}: StateProviderProps & { children: ReactNode }) {
  const [store] = useState(createCanvasStore);
  const actions = useCanvasValue(store, value, onChangeValue);

  return (
    <StoreContext.Provider value={store}>
      <ValueContext.Provider value={{ ...actions, value }}>
        <DragDropProvider sensors={DRAG_SENSORS}>
          {children}
          <PinDragOverlay />
        </DragDropProvider>
      </ValueContext.Provider>
    </StoreContext.Provider>
  );
}

export function useCanvasStore(): CanvasStoreApi {
  const store = useContext(StoreContext);
  if (!store) throw new StateProviderMissingError();
  return store;
}

export function useCanvas<T>(selector: (state: CanvasStore) => T): T {
  return useStore(useCanvasStore(), selector);
}

export function useMapValue(): ValueContextValue {
  const context = useContext(ValueContext);
  if (!context) throw new StateProviderMissingError();
  return context;
}
