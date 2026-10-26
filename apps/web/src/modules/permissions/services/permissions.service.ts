import type {
  PaginatedResponse,
  PermissionResourceRef,
  RolePermission,
} from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { PERMISSION_LIST_PAGE_SIZE } from "../permissions.constants";
import type { PermissionFlags } from "../permissions.types";

const permissionsUrl = (departmentId: string) =>
  `/departments/${departmentId}/permissions`;

export async function listPermissions(
  departmentId: string,
  resource: PermissionResourceRef,
): Promise<PaginatedResponse<RolePermission>> {
  const { data } = await apiClient.get<PaginatedResponse<RolePermission>>(
    permissionsUrl(departmentId),
    {
      params: {
        resourceType: resource.type,
        resourceId: resource.id,
        pageSize: PERMISSION_LIST_PAGE_SIZE,
      },
    },
  );
  return data;
}

export async function createPermission(
  departmentId: string,
  input: PermissionFlags & {
    roleId: string;
    resource: PermissionResourceRef;
  },
): Promise<RolePermission> {
  const { data } = await apiClient.post<RolePermission>(
    permissionsUrl(departmentId),
    input,
  );
  return data;
}

export async function updatePermission(
  departmentId: string,
  id: string,
  input: PermissionFlags,
): Promise<RolePermission> {
  const { data } = await apiClient.patch<RolePermission>(
    `${permissionsUrl(departmentId)}/${id}`,
    input,
  );
  return data;
}

export async function deletePermission(
  departmentId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`${permissionsUrl(departmentId)}/${id}`);
}
