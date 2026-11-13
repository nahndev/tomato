import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction, LinkAction, MailAction } from "@/shared/types/template.types";
import type { ComponentType } from "react";
import { MailActionSetup } from "./mail-action-setup";
import { OpenLinkActionSetup } from "./open-link-action-setup";

export interface ButtonActionSetupProps<T extends ButtonAction> {
  action: T;
  onChange: (next: T) => void;
}

export interface ButtonActionDefinition<T extends ButtonAction> {
  label: string;
  createDefault: () => T;
  SetupComponent: ComponentType<ButtonActionSetupProps<T>>;
}

export const BUTTON_ACTION_REGISTRY: {
  [ButtonActionType.LINK]: ButtonActionDefinition<LinkAction>;
  [ButtonActionType.MAIL]: ButtonActionDefinition<MailAction>;
} = {
  [ButtonActionType.LINK]: {
    label: "Open link",
    createDefault: () => ({ type: ButtonActionType.LINK, url: "" }),
    SetupComponent: OpenLinkActionSetup,
  },
  [ButtonActionType.MAIL]: {
    label: "Send mail",
    createDefault: () => ({ type: ButtonActionType.MAIL, recipients: [], subject: "", body: "" }),
    SetupComponent: MailActionSetup,
  },
};

export function getButtonActionDefinition<T extends ButtonAction>(action: T): ButtonActionDefinition<T> {
  return BUTTON_ACTION_REGISTRY[action.type] as unknown as ButtonActionDefinition<T>;
}
