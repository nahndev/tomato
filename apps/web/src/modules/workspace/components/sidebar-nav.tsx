"use client";

import { cn } from "@tomato/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSPACE_NAV_ITEMS } from "../workspace.constants";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center gap-2">
      {WORKSPACE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex size-9 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring",
              isActive && "bg-primary/20 text-primary hover:bg-primary/20",
            )}
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </Link>
        );
      })}
    </nav>
  );
}
