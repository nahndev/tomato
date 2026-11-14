import type { LucideIcon } from "lucide-react";
import { Book, SettingsIcon, SquareKanbanIcon } from "lucide-react";

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
      { label: "Boards", href: "/system/boards", icon: SquareKanbanIcon },
      { label: "Templates", href: "/system/templates", icon: Book },
    ],
  },
  {
    label: "Management",
    children: [
      { label: "Settings", href: "/system/settings", icon: SettingsIcon },
    ],
  },
];
