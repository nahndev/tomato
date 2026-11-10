"use client";

import { useHandler, useTransaction } from "@/shared/lib/sync";
import { LinkHandler } from "../handlers/link-handler";

export interface LinkActions {
  setWidgetLink: (widgetId: string, linkWidgetUuid: string | undefined) => void;
}

export function useLinkActions(): LinkActions {
  const linkHandler = useHandler(LinkHandler);
  const transact = useTransaction();

  return {
    setWidgetLink: (widgetId, linkWidgetUuid) => transact(() => linkHandler.setWidgetLink(widgetId, linkWidgetUuid)),
  };
}
