"use client";

import { PointerActivationConstraints } from "@dnd-kit/dom";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { useImageMapValue, type ImageMapValueActions } from "../hooks/use-image-map-value";
import { DRAG_THRESHOLD } from "../image-map.constants";
import {
  createImageMapStore,
  type ImageMapStore,
  type ImageMapStoreApi,
} from "../image-map.store";
import type { ImageMapValue } from "../image-map.types";
import { PinDragOverlay } from "./pin-drag-overlay";

class StateProviderMissingError extends Error {
  constructor() {
    super("image-map hooks must be used inside <StateProvider>");
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
  value: ImageMapValue;
  onChangeValue?: (value: ImageMapValue) => void;
}

interface ValueContextValue extends ImageMapValueActions {
  value: ImageMapValue;
}

const StoreContext = createContext<ImageMapStoreApi | null>(null);
const ValueContext = createContext<ValueContextValue | null>(null);

/** Holds the view state (store) and the controlled value with its actions. */
export function StateProvider({
  value,
  onChangeValue,
  children,
}: StateProviderProps & { children: ReactNode }) {
  const [store] = useState(createImageMapStore);
  const actions = useImageMapValue(store, value, onChangeValue);

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

export function useImageMapStore(): ImageMapStoreApi {
  const store = useContext(StoreContext);
  if (!store) throw new StateProviderMissingError();
  return store;
}

export function useImageMap<T>(selector: (state: ImageMapStore) => T): T {
  return useStore(useImageMapStore(), selector);
}

export function useMapValue(): ValueContextValue {
  const context = useContext(ValueContext);
  if (!context) throw new StateProviderMissingError();
  return context;
}
