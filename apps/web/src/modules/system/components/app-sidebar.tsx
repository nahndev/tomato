"use client";

import type { Theme } from "@tomato/constants";
import Image from "next/image";
import Link from "next/link";
import {
  SYSTEM_NAV_ITEMS,
  SYSTEM_PATH,
  type SystemNavGroup,
} from "../system.constants";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarNav } from "./sidebar-nav";

interface AppSidebarProps {
  theme: Theme;
  items?: readonly SystemNavGroup[];
  homeHref?: string;
}

export function AppSidebar({
  theme,
  items = SYSTEM_NAV_ITEMS,
  homeHref = SYSTEM_PATH,
}: AppSidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-3 px-3 py-3">
      <Link
        href={homeHref}
        aria-label="Tomato"
        className="flex h-9 shrink-0 items-center gap-2"
      >
        <Image src="/logo.svg" alt="" width={36} height={36} priority />
        <Image src="/logo-bar.svg" alt="" width={134} height={36} priority />
      </Link>
      <div className="h-4"></div>
      <SidebarNav items={items} />
      <SidebarFooter theme={theme} />
    </aside>
  );
}
