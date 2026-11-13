import { HistoryIcon, ListTreeIcon, MessageSquareIcon, Settings2Icon, TicketPlusIcon, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { ToolbarType } from "../../template-editor.constants";
import { ChatToolbar } from "./chat/chat-toolbar";
import { WidgetToolbar } from "./widget/widget-toolbar";
import { PropertyToolbar } from "./property/property-toolbar";
import { StructureToolbar } from "./structure/structure-toolbar";
import { VersionToolbar } from "./version/version-toolbar";

export interface ToolbarDefinition {
  type: ToolbarType;
  label: string;
  icon: LucideIcon;
  Component: ComponentType;
  /** Hidden outside edit mode (the chat needs the edit-only copilot provider). */
  isEditOnly?: boolean;
}

export const TOOLBAR_REGISTRY: Record<ToolbarType, ToolbarDefinition> = {
  [ToolbarType.WIDGET]: { type: ToolbarType.WIDGET, label: "Add widget", icon: TicketPlusIcon, Component: WidgetToolbar },
  [ToolbarType.STRUCTURE]: {
    type: ToolbarType.STRUCTURE,
    label: "Structure",
    icon: ListTreeIcon,
    Component: StructureToolbar,
  },
  [ToolbarType.PROPERTY]: {
    type: ToolbarType.PROPERTY,
    label: "Properties",
    icon: Settings2Icon,
    Component: PropertyToolbar,
  },
  [ToolbarType.VERSION]: { type: ToolbarType.VERSION, label: "Versions", icon: HistoryIcon, Component: VersionToolbar },
  [ToolbarType.CHAT]: {
    type: ToolbarType.CHAT,
    label: "Assistant",
    icon: MessageSquareIcon,
    Component: ChatToolbar,
    isEditOnly: true,
  },
};
