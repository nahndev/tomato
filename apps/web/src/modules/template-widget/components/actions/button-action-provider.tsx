"use client";

import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction } from "@/shared/types/template.types";
import { createStoreContext } from "@tomato/store-context";

export type RunButtonAction = (action: ButtonAction) => void | Promise<void>;

const defaultRunButtonAction: RunButtonAction = (action) => {
  if (action.type === ButtonActionType.LINK) {
    window.open(action.url, "_blank", "noopener,noreferrer");
    return;
  }
  console.warn(`Button action "${action.type}" isn't available in this context.`);
};

export const ButtonActionStore = createStoreContext<{ runAction: RunButtonAction }>("ButtonAction", {
  defaults: { runAction: defaultRunButtonAction },
});

export const ButtonActionProvider = ButtonActionStore.Provider;
