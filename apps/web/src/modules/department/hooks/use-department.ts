"use client";

import { useQuery } from "@tanstack/react-query";
import { departmentKeys } from "../department.keys";
import { getDepartment } from "../services/departments.service";

export function useDepartment(id: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => getDepartment(id),
  });

  return { department: data, isLoading, hasError: isError };
}
