"use client";

import { PointerActivationConstraints } from "@dnd-kit/dom";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { DRAG_THRESHOLD } from "../image-map.constants";
import {
  createImageMapStore,
  type ImageMapStore,
  type ImageMapStoreApi,
} from "../image-map.store";
import { PinDragOverlay } from "./pin-drag-overlay";

class ImageMapProviderMissingError extends Error {
  constructor() {
    super("useImageMap must be used inside <ImageMapProvider>");
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

const ImageMapContext = createContext<ImageMapStoreApi | null>(null);

export function ImageMapProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createImageMapStore);
  return (
    <ImageMapContext.Provider value={store}>
      <DragDropProvider sensors={DRAG_SENSORS}>
        <div className="size-full grid">{children}</div>
        <PinDragOverlay />
      </DragDropProvider>
    </ImageMapContext.Provider>
  );
}

export function useImageMapStore(): ImageMapStoreApi {
  const store = useContext(ImageMapContext);
  if (!store) throw new ImageMapProviderMissingError();
  return store;
}

export function useImageMap<T>(selector: (state: ImageMapStore) => T): T {
  return useStore(useImageMapStore(), selector);
}
