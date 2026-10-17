"use client";

import { ThemeSwitcher } from "@/modules/theme";
import type { Theme } from "@tomato/constants";
import { cn } from "@tomato/ui";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "../hooks/use-sidebar-store";
import { WORKSPACE_NAV_ITEMS, WORKSPACE_PATH } from "../workspace.constants";
import { getSidebarItemClass } from "../workspace.utils";
import { SidebarToggle } from "./sidebar-toggle";

export function AppSidebar({ theme }: { theme: Theme }) {
  const pathname = usePathname();
  const isExtended = useSidebarStore((state) => state.isExtended);

  const itemClass = getSidebarItemClass(isExtended);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col gap-3 py-3 transition-[width]",
        isExtended ? "w-60 items-stretch px-3" : "w-14 items-center",
      )}
    >
      <Link
        href={WORKSPACE_PATH}
        aria-label="Tomato"
        className="flex h-9 shrink-0 items-center gap-2"
      >
        <Image src="/logo.svg" alt="" width={36} height={36} priority />
        {isExtended && (
          <Image src="/logo-bar.svg" alt="" width={134} height={36} priority />
        )}
      </Link>
      <nav className={cn("flex flex-col gap-2", !isExtended && "items-center")}>
        {WORKSPACE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              aria-selected={isActive}
              className={itemClass}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.75} />
              {isExtended && <span className="truncate text-sm">{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div
        className={cn(
          "mt-auto flex flex-col gap-2",
          !isExtended && "items-center",
        )}
      >
        <button type="button" aria-label="Account" className={itemClass}>
          <UserIcon className="size-5 shrink-0" strokeWidth={1.75} />
          {isExtended && <span className="truncate text-sm">Account</span>}
        </button>
        <ThemeSwitcher initialTheme={theme} isExtended={isExtended} className={itemClass} />
        <SidebarToggle />
      </div>
    </aside>
  );
}
