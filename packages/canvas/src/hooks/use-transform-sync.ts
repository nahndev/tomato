import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "zustand";
import { selectIsReady, type CanvasStoreApi } from "../canvas.store";
import type { Transform } from "../canvas.types";
import { isSameTransform } from "../utils/transform.utils";

/** Syncs a controlled transform (`null` = fitted) with the store, both ways. */
export function useTransformSync(
  store: CanvasStoreApi,
  transform: Transform | null,
  onChange: (transform: Transform | null) => void,
) {
  const isReady = useStore(store, selectIsReady);
  const onChangeRef = useRef(onChange);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(
    () =>
      store.subscribe((state, previous) => {
        if (state.isFitted && previous.isFitted) return;
        if (state.transform === previous.transform && state.isFitted === previous.isFitted) return;
        onChangeRef.current(state.isFitted ? null : state.transform);
      }),
    [store],
  );

  useEffect(() => {
    if (!isReady) return;
    const state = store.getState();
    if (!transform) {
      if (!state.isFitted) state.reset();
      return;
    }
    if (!isSameTransform(transform, state.transform)) state.setTransform(transform);
  }, [store, isReady, transform]);
}
