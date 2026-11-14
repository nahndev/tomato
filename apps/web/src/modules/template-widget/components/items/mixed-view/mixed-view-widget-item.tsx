"use client";

import type { Session } from "@/shared/types/template.types";
import type { ReactNode } from "react";
import type { FieldComponentProps } from "../../../template-widget.types";
import { WidgetTabs } from "../../widget-tabs";

interface MixedViewWidgetItemProps extends FieldComponentProps {
  children?: (session: Session, columnWidth: number) => ReactNode;
  isAllMounted?: boolean;
}

export function MixedViewWidgetItem({ widget, children, isAllMounted }: MixedViewWidgetItemProps) {
  return (
    <WidgetTabs title={widget.label} tabs={widget.tabs ?? []} emptyText="No tabs yet" isAllMounted={isAllMounted}>
      {children}
    </WidgetTabs>
  );
}
