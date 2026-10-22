import type { LucideIcon } from "lucide-react";
import { Book, Building2Icon, SettingsIcon, SquareKanbanIcon } from "lucide-react";

export const WORKSPACE_PATH = "/workspace";

export interface WorkspaceNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const WORKSPACE_NAV_ITEMS: readonly WorkspaceNavItem[] = [
  { label: "Boards", href: `${WORKSPACE_PATH}/boards`, icon: SquareKanbanIcon },
  {
    label: "Templates",
    href: `${WORKSPACE_PATH}/templates`,
    icon: Book,
  },
  { label: "Units", href: `${WORKSPACE_PATH}/units`, icon: Building2Icon },
  { label: "Settings", href: `${WORKSPACE_PATH}/settings`, icon: SettingsIcon },
];

export const SIDEBAR_STORAGE_KEY = "tomato-sidebar";
