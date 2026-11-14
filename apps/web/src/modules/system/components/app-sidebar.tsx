"use client";

import { PrimaryLogo } from "@/shared/components/primary-logo";
import type { Theme } from "@tomato/constants";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  SYSTEM_NAV_ITEMS,
  type SystemNavGroup,
} from "../system.constants";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarNav } from "./sidebar-nav";

interface AppSidebarProps {
  theme: Theme;
  items?: readonly SystemNavGroup[];
  homeHref?: string;
  children?: ReactNode;
}

export function AppSidebar({
  theme,
  items = SYSTEM_NAV_ITEMS,
  homeHref = "/system",
  children,
}: AppSidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-3 px-3 py-3">
      <Link
        href={homeHref}
        aria-label="Tomato"
        className="flex h-9 shrink-0 items-center gap-2"
      >
        <PrimaryLogo />
      </Link>
      <div className="h-4"></div>
      <div className="flex flex-col gap-4">
        <SidebarNav items={items} />
        {children}
      </div>
      <SidebarFooter theme={theme} />
    </aside>
  );
}
