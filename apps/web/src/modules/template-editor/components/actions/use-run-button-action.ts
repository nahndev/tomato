"use client";

import { useContext } from "react";
import { ButtonActionContext, type RunButtonAction } from "./button-action-context";

export function useRunButtonAction(): RunButtonAction {
  return useContext(ButtonActionContext);
}
