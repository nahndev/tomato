"use client";

import type { Theme } from "@tomato/constants";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/modules/theme";
import { WORKSPACE_NAV_ITEMS, WORKSPACE_PATH } from "../workspace.constants";

export function AppSidebar({ theme }: { theme: Theme }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-3 py-3">
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
              aria-selected={isActive}
              className="variant-ghost flex size-9 items-center justify-center rounded-md"
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-2">
        <button
          type="button"
          aria-label="Account"
          className="variant-ghost flex size-9 items-center justify-center rounded-lg"
        >
          <UserIcon className="size-5" strokeWidth={1.75} />
        </button>
        <ThemeSwitcher initialTheme={theme} />
      </div>
    </aside>
  );
}
