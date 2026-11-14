"use client";

import { cn, Typography } from "@tomato/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SystemNavGroup } from "../system.constants";
import { getSidebarItemClass } from "../system.utils";

const GROUP_LABEL_CLASS = "truncate px-2 text-xs font-medium text-muted-foreground";

interface SidebarNavProps {
  items: readonly SystemNavGroup[];
  basePath?: string;
}

export function SidebarNav({ items, basePath = "" }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-4">
      <SidebarNavItems items={items} basePath={basePath} />
    </nav>
  );
}

function SidebarNavItems({ items, basePath }: Required<SidebarNavProps>) {
  const pathname = usePathname();

  return items.map(({ label: groupLabel, href: groupPath, children }) => (
    <div key={groupLabel} className="flex flex-col gap-2">
      {groupPath ? (
        <Link
          href={`${basePath}${groupPath}`}
          aria-current={pathname === `${basePath}${groupPath}` ? "page" : undefined}
          className={cn(GROUP_LABEL_CLASS, "hover:text-foreground aria-[current=page]:text-foreground")}
        >
          {groupLabel}
        </Link>
      ) : (
        <Typography className={GROUP_LABEL_CLASS}>{groupLabel}</Typography>
      )}
      {children.map(({ label, href: path, icon: Icon }) => {
        const href = `${basePath}${path}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            aria-selected={isActive}
            className={getSidebarItemClass()}
          >
            <Icon className="size-5 shrink-0" strokeWidth={1.75} />
            <Typography className="truncate text-sm">{label}</Typography>
          </Link>
        );
      })}
    </div>
  ));
}
