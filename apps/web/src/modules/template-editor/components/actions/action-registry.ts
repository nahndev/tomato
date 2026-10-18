import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction, LinkAction, MailAction } from "@tomato/types";
import type { ComponentType } from "react";
import { MailActionSetup } from "./mail-action-setup";
import { OpenLinkActionSetup } from "./open-link-action-setup";

export interface ActionSetupProps<T extends ButtonAction> {
  action: T;
  onChange: (next: T) => void;
}

export interface ActionDefinition<T extends ButtonAction> {
  label: string;
  createDefault: () => T;
  SetupComponent: ComponentType<ActionSetupProps<T>>;
}

export const ACTION_REGISTRY: {
  [ButtonActionType.LINK]: ActionDefinition<LinkAction>;
  [ButtonActionType.MAIL]: ActionDefinition<MailAction>;
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

export function getActionDefinition<T extends ButtonAction>(action: T): ActionDefinition<T> {
  return ACTION_REGISTRY[action.type] as unknown as ActionDefinition<T>;
}
