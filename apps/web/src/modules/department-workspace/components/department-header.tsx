"use client";

import { useDepartment } from "@/modules/department";
import { Spinner, Typography } from "@tomato/ui";

export function DepartmentHeader({ slug }: { slug: string }) {
  const { department, isLoading, hasError } = useDepartment(slug);

  if (isLoading) return <Spinner />;
  if (hasError || !department) return <Typography as="p" className="text-muted-foreground">Department not found.</Typography>;

  return <Typography as="h1" className="text-xl font-semibold">{department.name}</Typography>;
}
