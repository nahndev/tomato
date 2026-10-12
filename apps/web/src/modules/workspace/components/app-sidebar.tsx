"use client";

import { cn } from "@tomato/ui";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSPACE_NAV_ITEMS, WORKSPACE_PATH } from "../workspace.constants";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-3 bg-sidebar py-3">
      <Link href={WORKSPACE_PATH} aria-label="Tomato">
        <Image src="/logo.svg" alt="" width={36} height={36} priority />
      </Link>
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
      <button
        type="button"
        aria-label="Account"
        className="mt-auto flex size-9 items-center justify-center rounded-full bg-muted text-sidebar-foreground transition-colors hover:bg-canvas hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <UserIcon className="size-5" strokeWidth={1.75} />
      </button>
    </aside>
  );
}
