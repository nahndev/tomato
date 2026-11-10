"use client";

import { LinkTargetType } from "@tomato/constants";
import type { ReactNode } from "react";
import { useRepeatTabs } from "../../hooks/use-repeat-tabs";
import type { FieldComponentProps, ViewTab } from "../../template-widget.types";
import { useWidgetById, useWidgetLink } from "../widgets-context";
import { WidgetTabs } from "./widget-tabs";

interface RepeatViewWidgetItemProps extends FieldComponentProps {
  children?: (tab: ViewTab, columnWidth: number) => ReactNode;
  isAllMounted?: boolean;
}

export function RepeatViewWidgetItem({ widget, children, isAllMounted }: RepeatViewWidgetItemProps) {
  const linkWidgetUuid = useWidgetLink(widget.id)?.[LinkTargetType.WIDGET]?.uuid;
  const tabs = useRepeatTabs(linkWidgetUuid);
  const hasLinkWidget = Boolean(useWidgetById(linkWidgetUuid));

  return (
    <WidgetTabs
      title={widget.label}
      tabs={tabs}
      emptyText={hasLinkWidget ? "No items to repeat yet" : "Pick a widget to repeat"}
      isAllMounted={isAllMounted}
    >
      {children}
    </WidgetTabs>
  );
}
