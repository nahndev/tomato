import type { SystemNavGroup } from "@/modules/system";
import { FileTextIcon, ShieldIcon, UsersIcon } from "lucide-react";

export const DEPARTMENT_PATH = "/department";

export const DepartmentSection = {
  USER: "user",
  DOCUMENTS: "documents",
  ROLES: "roles",
} as const;
export type DepartmentSection = (typeof DepartmentSection)[keyof typeof DepartmentSection];

export const DEPARTMENT_SECTIONS: readonly SystemNavGroup[] = [
  {
    label: "Menu",
    children: [
      { label: "Users", href: `/${DepartmentSection.USER}`, icon: UsersIcon },
      { label: "Documents", href: `/${DepartmentSection.DOCUMENTS}`, icon: FileTextIcon },
      { label: "Roles", href: `/${DepartmentSection.ROLES}`, icon: ShieldIcon },
    ],
  },
];
