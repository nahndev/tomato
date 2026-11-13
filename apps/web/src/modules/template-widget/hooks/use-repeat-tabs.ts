"use client";

import { useWidgetById } from "@/modules/template-store";
import { useMemo } from "react";
import type { ViewTab } from "../template-widget.types";
import { sortOptions } from "../utils/options";
import { isRepeatLinkWidget } from "../utils/repeat-view";

export function useRepeatTabs(linkWidgetUuid: string | undefined): ViewTab[] {
  const linkWidget = useWidgetById(linkWidgetUuid);
  const options = linkWidget && isRepeatLinkWidget(linkWidget) ? linkWidget.options : undefined;
  return useMemo(() => sortOptions(options).map((option) => ({ id: option.key, name: option.value })), [options]);
}
