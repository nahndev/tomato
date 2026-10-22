import type { LucideIcon } from "lucide-react";
import { MessageSquareIcon, UsersIcon } from "lucide-react";

export const DEPARTMENT_PATH = "/department";

export const DepartmentSection = {
  USER: "user",
  CHAT: "chat",
} as const;
export type DepartmentSection = (typeof DepartmentSection)[keyof typeof DepartmentSection];

export const DEPARTMENT_SECTIONS: readonly { label: string; section: DepartmentSection; icon: LucideIcon }[] = [
  { label: "Users", section: DepartmentSection.USER, icon: UsersIcon },
  { label: "Chat", section: DepartmentSection.CHAT, icon: MessageSquareIcon },
];
