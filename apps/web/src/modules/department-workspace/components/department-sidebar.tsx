"use client";

import { useDepartment } from "@/modules/department";
import { SYSTEM_PATH, SidebarFooter, SidebarNav, getSidebarItemClass } from "@/modules/system";
import type { Theme } from "@tomato/constants";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { DEPARTMENT_SECTIONS } from "../department-workspace.constants";
import { getDepartmentHref } from "../department-workspace.utils";

export function DepartmentSidebar({ slug, theme }: { slug: string; theme: Theme }) {
  const { department } = useDepartment(slug);

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-3 px-3 py-3">
      <Link href={getDepartmentHref(slug)} className="flex h-9 shrink-0 items-center px-2">
        {department ? (
          <span className="truncate text-lg font-semibold">{department.name}</span>
        ) : (
          <span className="h-5 w-32 animate-pulse rounded bg-muted" />
        )}
      </Link>
      <SidebarNav items={DEPARTMENT_SECTIONS} basePath={getDepartmentHref(slug)} />
      <SidebarFooter theme={theme}>
        <Link href={SYSTEM_PATH} className={getSidebarItemClass()}>
          <LayoutDashboardIcon className="size-5 shrink-0" strokeWidth={1.75} />
          <span className="truncate text-sm">System</span>
        </Link>
      </SidebarFooter>
    </aside>
  );
}
