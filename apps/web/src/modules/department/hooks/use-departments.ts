"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentKeys } from "../department.keys";
import type { DepartmentInput } from "../department.schemas";
import {
  createDepartment,
  deleteDepartment,
  listDepartments,
  updateDepartment,
} from "../services/departments.service";

export function useDepartments() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: departmentKeys.all });

  const { data, isLoading, isError } = useQuery({ queryKey: departmentKeys.all, queryFn: listDepartments });

  const addMutation = useMutation({
    mutationFn: (input: DepartmentInput) => createDepartment(input),
    onSuccess: invalidate,
  });
  const editMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<DepartmentInput> }) => updateDepartment(id, input),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({ mutationFn: (id: string) => deleteDepartment(id), onSuccess: invalidate });

  return {
    departments: data?.items ?? [],
    isLoading,
    hasError: isError,
    add: async (input: DepartmentInput) => {
      await addMutation.mutateAsync(input);
    },
    edit: async (id: string, input: Partial<DepartmentInput>) => {
      await editMutation.mutateAsync({ id, input });
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
    },
  };
}
