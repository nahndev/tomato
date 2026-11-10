"use client";

import type { Session } from "@tomato/types";
import type { ReactNode } from "react";
import type { FieldComponentProps } from "../../template-widget.types";
import { WidgetTabs } from "./widget-tabs";

interface MixedViewWidgetItemProps extends FieldComponentProps {
  /** The widgets inside a tab; the editor and the form each render their own. */
  children?: (session: Session, columnWidth: number) => ReactNode;
  /** Keeps every tab mounted, not only the active one. */
  isAllMounted?: boolean;
}

export function MixedViewWidgetItem({ widget, children, isAllMounted }: MixedViewWidgetItemProps) {
  return (
    <WidgetTabs title={widget.label} tabs={widget.tabs ?? []} emptyText="No tabs yet" isAllMounted={isAllMounted}>
      {children}
    </WidgetTabs>
  );
}
