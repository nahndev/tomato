import type { PaginatedResponse } from "@/shared/types/api.types";
import { apiClient } from "@/shared/lib/api-client";
import { ROLE_LIST_PAGE_SIZE } from "../roles.constants";
import type { RoleDetailInput, RoleInput } from "../roles.schemas";
import type { Role } from "../roles.types";

const rolesUrl = (departmentId: string) => `/departments/${departmentId}/roles`;

export async function listRoles(
  departmentId: string,
): Promise<PaginatedResponse<Role>> {
  const { data } = await apiClient.get<PaginatedResponse<Role>>(
    rolesUrl(departmentId),
    {
      params: { pageSize: ROLE_LIST_PAGE_SIZE },
    },
  );
  return data;
}

export async function getRole(departmentId: string, id: string): Promise<Role> {
  const { data } = await apiClient.get<Role>(`${rolesUrl(departmentId)}/${id}`);
  return data;
}

export async function createRole(
  departmentId: string,
  input: RoleInput,
): Promise<Role> {
  const { data } = await apiClient.post<Role>(rolesUrl(departmentId), input);
  return data;
}

export async function updateRole(
  departmentId: string,
  id: string,
  input: Partial<RoleDetailInput>,
): Promise<Role> {
  const { data } = await apiClient.patch<Role>(
    `${rolesUrl(departmentId)}/${id}`,
    input,
  );
  return data;
}

export async function deleteRole(
  departmentId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`${rolesUrl(departmentId)}/${id}`);
}
