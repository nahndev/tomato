"use client";

import { getDepartmentHref } from "@/modules/department";
import { SidebarNav } from "@/modules/system";
import { DEPARTMENT_SECTIONS } from "../department-workspace.constants";

export function DepartmentSidebar({ slug }: { slug: string }) {
  return (
    <aside className="w-48 shrink-0">
      <SidebarNav items={DEPARTMENT_SECTIONS} basePath={getDepartmentHref(slug)} />
    </aside>
  );
}
