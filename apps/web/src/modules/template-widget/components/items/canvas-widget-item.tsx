"use client";

import { GRID_COLUMNS } from "@tomato/grid";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { FieldComponentProps } from "../../template-widget.types";

interface CanvasWidgetItemProps extends FieldComponentProps {
  /** The widgets inside the canvas; the editor and the form each render their own. */
  children?: (columnWidth: number) => ReactNode;
}

export function CanvasWidgetItem({ widget, children }: CanvasWidgetItemProps) {
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
        {children && columnWidth > 0 && children(columnWidth)}
      </div>
    </div>
  );
}
