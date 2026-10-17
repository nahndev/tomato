import { AppSidebar } from "@/modules/workspace";
import type { ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col bg-canvas text-foreground p-6">
        {children}
      </main>
    </div>
  );
}
