"use client";

import { AppSidebar } from "@/modules/workspace";
import type { Theme } from "@tomato/constants";
import { getDepartmentHref, getDepartmentNavItems } from "../department-workspace.utils";

export function DepartmentSidebar({ slug, theme }: { slug: string; theme: Theme }) {
  return <AppSidebar theme={theme} items={getDepartmentNavItems(slug)} homeHref={getDepartmentHref(slug)} />;
}
