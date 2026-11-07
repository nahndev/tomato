import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactZoomPanPinchContentRef, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useImageMapStore } from "../components/state-provider";
import type { Transform } from "../image-map.types";
import { isSameTransform } from "../utils/transform.utils";

type Gesture = "pan" | "pinch" | "wheel";

function toTransform(state: { scale: number; positionX: number; positionY: number }): Transform {
  return { scale: state.scale, x: state.positionX, y: state.positionY };
}

/**
 * The store clamps and fits; `react-zoom-pan-pinch` only handles gestures and renders.
 * Library moves outside a gesture (initial centering, resize alignment) are reverted.
 */
export function useZoomPanPinchSync() {
  const store = useImageMapStore();
  const ref = useRef<ReactZoomPanPinchContentRef>(null);
  const gesturesRef = useRef(new Set<Gesture>());
  const isPushingRef = useRef(false);

  const push = useCallback((transform: Transform) => {
    const controls = ref.current;
    if (!controls || isPushingRef.current || isSameTransform(transform, toTransform(controls.instance.state))) return;
    // The library may adjust the pushed transform; its echo must not push again.
    isPushingRef.current = true;
    try {
      void controls.setTransform(transform.x, transform.y, transform.scale, 0);
    } finally {
      isPushingRef.current = false;
    }
  }, []);

  useEffect(() => {
    push(store.getState().transform);
    return store.subscribe((state, previous) => {
      if (state.transform !== previous.transform) push(state.transform);
    });
  }, [store, push]);

  const handleTransform = useCallback(
    (_: ReactZoomPanPinchRef, state: { scale: number; positionX: number; positionY: number }) => {
      const { transform, setTransform } = store.getState();
      if (gesturesRef.current.size > 0) setTransform(toTransform(state));
      else push(transform);
    },
    [store, push],
  );

  const gesture = useMemo(
    () => ({
      start: (name: Gesture) => gesturesRef.current.add(name),
      stop: (name: Gesture) => gesturesRef.current.delete(name),
    }),
    [],
  );

  return { ref, handleTransform, gesture };
}
