"use client";

import { LinkTargetType } from "@tomato/constants";
import { useWidget, useWidgetLink } from "@/modules/template-data";
import type { ReactNode } from "react";
import { useRepeatTabs } from "./use-repeat-tabs";
import type { FieldComponentProps, ViewTab } from "../../../template-widget.types";
import { WidgetTabs } from "../../widget-tabs";

interface RepeatViewWidgetItemProps extends FieldComponentProps {
  children?: (tab: ViewTab, columnWidth: number) => ReactNode;
  isAllMounted?: boolean;
}

export function RepeatViewWidgetItem({ widget, children, isAllMounted }: RepeatViewWidgetItemProps) {
  const linkWidgetUuid = useWidgetLink(widget.id)?.[LinkTargetType.WIDGET]?.uuid;
  const tabs = useRepeatTabs(linkWidgetUuid);
  const hasLinkWidget = Boolean(useWidget(linkWidgetUuid));

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
