import { DepartmentHeader, DepartmentSidebar } from "@/modules/department-workspace";
import { THEME_COOKIE, resolveTheme } from "@/modules/theme";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

interface DepartmentLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DepartmentLayout({ children, params }: DepartmentLayoutProps) {
  const [{ slug }, cookieStore] = await Promise.all([params, cookies()]);
  const theme = resolveTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <div className="flex min-h-screen">
      <DepartmentSidebar slug={slug} theme={theme} />
      <main className="flex min-w-0 flex-1 flex-col gap-4 bg-canvas text-foreground p-6">
        <DepartmentHeader slug={slug} />
        {children}
      </main>
    </div>
  );
}
