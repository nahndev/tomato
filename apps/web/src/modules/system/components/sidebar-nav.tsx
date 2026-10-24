"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SystemNavGroup } from "../system.constants";
import { getSidebarItemClass } from "../system.utils";

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

  return items.map(({ label: groupLabel, children }) => (
    <div key={groupLabel} className="flex flex-col gap-2">
      <span className="truncate px-2 text-xs font-medium text-muted-foreground">{groupLabel}</span>
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
            <span className="truncate text-sm">{label}</span>
          </Link>
        );
      })}
    </div>
  ));
}
