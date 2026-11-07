import { useEffect, type RefObject } from "react";
import { useImageMapStore } from "../components/state-provider";

/** Registers the viewport element and its size in the store. */
export function useViewportObserver(ref: RefObject<HTMLElement | null>) {
  const store = useImageMapStore();

  useEffect(() => {
    const viewport = ref.current;
    if (!viewport) return;
    const { setViewport, setViewportSize } = store.getState();
    setViewport(viewport);

    const observer = new ResizeObserver(([entry]) => {
      if (entry)
        setViewportSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
    });
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      setViewport(null);
    };
  }, [ref, store]);
}
