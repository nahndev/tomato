"use client";

import { GRID_COLUMNS } from "@tomato/grid";
import { useEffect, useRef, useState, type RefObject } from "react";

export function useColumnWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [columnWidth, setColumnWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setColumnWidth(Math.floor(entry.contentRect.width / GRID_COLUMNS));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, columnWidth];
}
