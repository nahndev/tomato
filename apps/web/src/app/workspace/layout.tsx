import { AppSidebar } from "@/modules/workspace";
import type { ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col bg-canvas p-6 text-foreground">
        {children}
      </main>
    </div>
  );
}
