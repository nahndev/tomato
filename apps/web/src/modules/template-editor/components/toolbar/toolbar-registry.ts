import { HistoryIcon, ListTreeIcon, MessageSquareIcon, Settings2Icon, TicketPlusIcon, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { TemplateCopilotChat } from "../../sync/copilot/template-copilot-chat";
import { WidgetPicker } from "./creation/widget-picker";
import { WidgetPropertyBox } from "./property/widget-property-box";
import { StructureToolbarBox } from "./structure/structure-toolbar-box";
import { VersionSetting } from "./version/version-setting";

export const ToolbarType = {
  WIDGET: "widget",
  STRUCTURE: "structure",
  PROPERTY: "property",
  VERSION: "version",
  CHAT: "chat",
} as const;
export type ToolbarType = (typeof ToolbarType)[keyof typeof ToolbarType];

export interface ToolbarDefinition {
  type: ToolbarType;
  label: string;
  icon: LucideIcon;
  Component: ComponentType;
  /** Hidden outside edit mode (the chat needs the edit-only copilot provider). */
  isEditOnly?: boolean;
}

export const TOOLBAR_REGISTRY: Record<ToolbarType, ToolbarDefinition> = {
  [ToolbarType.WIDGET]: { type: ToolbarType.WIDGET, label: "Add widget", icon: TicketPlusIcon, Component: WidgetPicker },
  [ToolbarType.STRUCTURE]: {
    type: ToolbarType.STRUCTURE,
    label: "Structure",
    icon: ListTreeIcon,
    Component: StructureToolbarBox,
  },
  [ToolbarType.PROPERTY]: {
    type: ToolbarType.PROPERTY,
    label: "Properties",
    icon: Settings2Icon,
    Component: WidgetPropertyBox,
  },
  [ToolbarType.VERSION]: { type: ToolbarType.VERSION, label: "Versions", icon: HistoryIcon, Component: VersionSetting },
  [ToolbarType.CHAT]: {
    type: ToolbarType.CHAT,
    label: "Assistant",
    icon: MessageSquareIcon,
    Component: TemplateCopilotChat,
    isEditOnly: true,
  },
};
