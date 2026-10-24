import { THEME_COOKIE, resolveTheme } from "@/modules/theme";
import { AppSidebar } from "@/modules/system";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

export default async function SystemLayout({ children }: { children: ReactNode }) {
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <div className="flex min-h-screen">
      <AppSidebar theme={theme} />
      <main className="flex min-w-0 flex-1 flex-col bg-canvas text-foreground p-6">
        {children}
      </main>
    </div>
  );
}
