import type { LucideIcon } from "lucide-react";
import { Book, Building2Icon, SettingsIcon, SquareKanbanIcon } from "lucide-react";

export const SYSTEM_PATH = "/system";

export interface SystemNavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SystemNavGroup {
  label: string;
  children: readonly SystemNavLink[];
}

export type SystemNavItem = SystemNavLink | SystemNavGroup;

export const SYSTEM_NAV_ITEMS: readonly SystemNavGroup[] = [
  {
    label: "Forms",
    children: [
      { label: "Boards", href: `${SYSTEM_PATH}/boards`, icon: SquareKanbanIcon },
      { label: "Templates", href: `${SYSTEM_PATH}/templates`, icon: Book },
    ],
  },
  {
    label: "Management",
    children: [
      { label: "Departments", href: `${SYSTEM_PATH}/departments`, icon: Building2Icon },
      { label: "Settings", href: `${SYSTEM_PATH}/settings`, icon: SettingsIcon },
    ],
  },
];
