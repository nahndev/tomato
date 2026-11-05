"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentKeys } from "../department.keys";
import type { DepartmentInput } from "../department.schemas";
import { createDepartment, listDepartments } from "../services/departments.service";

// Separate key: sharing the list query breaks hydration of DepartmentList.
export function useDepartmentMenu() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: departmentKeys.menu(), queryFn: listDepartments });
  const addMutation = useMutation({
    mutationFn: (input: DepartmentInput) => createDepartment(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
  });

  return {
    departments: data?.items ?? [],
    add: async (input: DepartmentInput) => {
      await addMutation.mutateAsync(input);
    },
  };
}
