import { DepartmentSidebar } from "@/modules/department-workspace";
import type { ReactNode } from "react";

interface DepartmentLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DepartmentLayout({ children, params }: DepartmentLayoutProps) {
  const { slug } = await params;

  return (
    <div className="flex min-w-0 flex-1 gap-6">
      <DepartmentSidebar slug={slug} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
