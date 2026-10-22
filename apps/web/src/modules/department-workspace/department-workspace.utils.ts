import type { WorkspaceNavItem } from "@/modules/workspace";
import { DEPARTMENT_PATH, DEPARTMENT_SECTIONS } from "./department-workspace.constants";

export function getDepartmentHref(slug: string) {
  return `${DEPARTMENT_PATH}/${slug}`;
}

export function getDepartmentNavItems(slug: string): WorkspaceNavItem[] {
  return DEPARTMENT_SECTIONS.map(({ label, section, icon }) => ({
    label,
    href: `${getDepartmentHref(slug)}/${section}`,
    icon,
  }));
}
