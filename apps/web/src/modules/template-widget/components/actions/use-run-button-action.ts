"use client";

import { ButtonActionStore, type RunButtonAction } from "./button-action-provider";

export function useRunButtonAction(): RunButtonAction {
  return ButtonActionStore.useSelector((state) => state.runAction);
}
