"use client";

import type { ReactNode } from "react";
import { useColumnWidth } from "../../../hooks/use-column-width";
import type { FieldComponentProps } from "../../../template-widget.types";

interface CanvasWidgetItemProps extends FieldComponentProps {
  /** The widgets inside the canvas; the editor and the form each render their own. */
  children?: (columnWidth: number) => ReactNode;
}

export function CanvasWidgetItem({ widget, children }: CanvasWidgetItemProps) {
  const [contentRef, columnWidth] = useColumnWidth<HTMLDivElement>();

  return (
    <div className="flex flex-col rounded-md border border-border bg-card">
      <p className="truncate border-b border-border px-3 py-2 text-sm font-medium">{widget.label || "(no title)"}</p>
      <div ref={contentRef} className="p-1">
        {children && columnWidth > 0 && children(columnWidth)}
      </div>
    </div>
  );
}
