import type { LucideIcon } from "lucide-react";
import { Book, SettingsIcon, SquareKanbanIcon } from "lucide-react";

export const SYSTEM_PATH = "/system";
export const DEPARTMENTS_PATH = `${SYSTEM_PATH}/departments`;

export interface SystemNavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SystemNavGroup {
  label: string;
  href?: string;
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
      { label: "Settings", href: `${SYSTEM_PATH}/settings`, icon: SettingsIcon },
    ],
  },
];
