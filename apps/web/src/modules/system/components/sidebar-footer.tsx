"use client";

import { ThemeSwitcher } from "@/modules/theme";
import type { Theme } from "@tomato/constants";
import { UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { getSidebarItemClass } from "../system.utils";

interface SidebarFooterProps {
  theme: Theme;
  children?: ReactNode;
}

export function SidebarFooter({ theme, children }: SidebarFooterProps) {
  return (
    <div className="mt-auto flex flex-col gap-2">
      {children}
      <button type="button" className={getSidebarItemClass()}>
        <UserIcon className="size-5 shrink-0" strokeWidth={1.75} />
        <span className="truncate text-sm">Account</span>
      </button>
      <ThemeSwitcher initialTheme={theme} className={getSidebarItemClass()} />
    </div>
  );
}
