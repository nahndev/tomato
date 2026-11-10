"use client";

import { GRID_COLUMNS } from "@tomato/grid";
import { useEffect, useRef, useState } from "react";
import type { FieldComponentProps } from "../../template-widget.types";
import { useWidgetContainer } from "../widget-container-context";

export function CanvasWidgetItem({ widget }: FieldComponentProps) {
  const Container = useWidgetContainer();
  const contentRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState(0);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setColumnWidth(Math.floor(entry.contentRect.width / GRID_COLUMNS));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col rounded-md border border-border bg-card">
      <p className="truncate border-b border-border px-3 py-2 text-sm font-medium">{widget.label || "(no title)"}</p>
      <div ref={contentRef} className="p-1">
        {Container && columnWidth > 0 && <Container containerId={widget.id} columnWidth={columnWidth} />}
      </div>
    </div>
  );
}
