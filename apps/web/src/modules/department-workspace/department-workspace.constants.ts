import type { SystemNavGroup } from "@/modules/system";
import { MessageSquareIcon, UsersIcon } from "lucide-react";

export const DEPARTMENT_PATH = "/department";

export const DepartmentSection = {
  USER: "user",
  CHAT: "chat",
} as const;
export type DepartmentSection = (typeof DepartmentSection)[keyof typeof DepartmentSection];

export const DEPARTMENT_SECTIONS: readonly SystemNavGroup[] = [
  {
    label: "Menu",
    children: [
      { label: "Users", href: `/${DepartmentSection.USER}`, icon: UsersIcon },
      { label: "Chat", href: `/${DepartmentSection.CHAT}`, icon: MessageSquareIcon },
    ],
  },
];
