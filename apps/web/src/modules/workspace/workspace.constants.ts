import { LayoutTemplateIcon, SettingsIcon, SquareKanbanIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const WORKSPACE_PATH = '/workspace';

export interface WorkspaceNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const WORKSPACE_NAV_ITEMS: readonly WorkspaceNavItem[] = [
  { label: 'Boards', href: `${WORKSPACE_PATH}/boards`, icon: SquareKanbanIcon },
  { label: 'Templates', href: `${WORKSPACE_PATH}/templates`, icon: LayoutTemplateIcon },
  { label: 'Settings', href: `${WORKSPACE_PATH}/settings`, icon: SettingsIcon },
];
