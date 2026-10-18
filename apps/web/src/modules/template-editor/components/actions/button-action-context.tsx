"use client";

import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction } from "@tomato/types";
import { createContext } from "react";

export type RunButtonAction = (action: ButtonAction) => void | Promise<void>;

/** Only `link` is meaningful without a submission context; other actions warn until a feature provides one. */
const defaultRunButtonAction: RunButtonAction = (action) => {
  if (action.type === ButtonActionType.LINK) {
    window.open(action.url, "_blank", "noopener,noreferrer");
    return;
  }
  console.warn(`Button action "${action.type}" isn't available in this context.`);
};

export const ButtonActionContext = createContext<RunButtonAction>(defaultRunButtonAction);

export const ButtonActionProvider = ButtonActionContext.Provider;
