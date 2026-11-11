import type { PaginatedResponse } from "@/shared/types/api.types";
import type { DepartmentMap } from "../map.types";
import { apiClient } from "@/shared/lib/api-client";
import { MAP_LIST_PAGE_SIZE } from "../map.constants";
import type { MapInput, MapUpdateInput } from "../map.schemas";

export async function listMaps(
  departmentId: string,
): Promise<PaginatedResponse<DepartmentMap>> {
  const { data } = await apiClient.get<PaginatedResponse<DepartmentMap>>(
    `/departments/${departmentId}/maps`,
    { params: { pageSize: MAP_LIST_PAGE_SIZE } },
  );
  return data;
}

export async function createMap(
  departmentId: string,
  input: MapInput,
): Promise<DepartmentMap> {
  const { data } = await apiClient.post<DepartmentMap>(
    `/departments/${departmentId}/maps`,
    input,
  );
  return data;
}

export async function getMap(id: string): Promise<DepartmentMap> {
  const { data } = await apiClient.get<DepartmentMap>(`/maps/${id}`);
  return data;
}

export async function updateMap(
  id: string,
  input: MapUpdateInput,
): Promise<DepartmentMap> {
  const { data } = await apiClient.patch<DepartmentMap>(`/maps/${id}`, input);
  return data;
}

export async function deleteMap(id: string): Promise<void> {
  await apiClient.delete(`/maps/${id}`);
}
