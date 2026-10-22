"use client";

import { useDepartment } from "@/modules/department";
import { Spinner } from "@tomato/ui";

export function DepartmentHeader({ slug }: { slug: string }) {
  const { department, isLoading, hasError } = useDepartment(slug);

  if (isLoading) return <Spinner />;
  if (hasError || !department) return <p className="text-muted-foreground">Department not found.</p>;

  return <h1 className="text-xl font-semibold">{department.name}</h1>;
}
