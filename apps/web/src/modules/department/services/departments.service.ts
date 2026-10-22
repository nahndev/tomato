import type { Department, PaginatedResponse } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { DEPARTMENT_LIST_PAGE_SIZE } from "../department.constants";
import type { DepartmentInput } from "../department.schemas";

const DEPARTMENTS_URL = "/departments";

export async function listDepartments(): Promise<PaginatedResponse<Department>> {
  const { data } = await apiClient.get<PaginatedResponse<Department>>(DEPARTMENTS_URL, {
    params: { pageSize: DEPARTMENT_LIST_PAGE_SIZE },
  });
  return data;
}

export async function createDepartment(input: DepartmentInput): Promise<Department> {
  const { data } = await apiClient.post<Department>(DEPARTMENTS_URL, input);
  return data;
}

export async function updateDepartment(id: string, input: Partial<DepartmentInput>): Promise<Department> {
  const { data } = await apiClient.patch<Department>(`${DEPARTMENTS_URL}/${id}`, input);
  return data;
}

export async function deleteDepartment(id: string): Promise<void> {
  await apiClient.delete(`${DEPARTMENTS_URL}/${id}`);
}
