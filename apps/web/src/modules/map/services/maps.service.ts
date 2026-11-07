import type {
  DepartmentMap,
  DepartmentMapDetail,
  MapPin,
  PaginatedResponse,
} from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { MAP_LIST_PAGE_SIZE } from "../map.constants";
import type {
  MapInput,
  MapPinCreateInput,
  MapPinUpdateInput,
} from "../map.schemas";

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

export async function getMap(id: string): Promise<DepartmentMapDetail> {
  const { data } = await apiClient.get<DepartmentMapDetail>(`/maps/${id}`);
  return data;
}

export async function updateMap(
  id: string,
  input: MapInput,
): Promise<DepartmentMap> {
  const { data } = await apiClient.patch<DepartmentMap>(`/maps/${id}`, input);
  return data;
}

export async function setMapImage(
  id: string,
  fileId: string,
): Promise<DepartmentMap> {
  const { data } = await apiClient.put<DepartmentMap>(`/maps/${id}/image`, {
    fileId,
  });
  return data;
}

export async function deleteMap(id: string): Promise<void> {
  await apiClient.delete(`/maps/${id}`);
}

export async function createMapPin(
  mapId: string,
  input: MapPinCreateInput,
): Promise<MapPin> {
  const { data } = await apiClient.post<MapPin>(`/maps/${mapId}/pins`, input);
  return data;
}

export async function updateMapPin(
  mapId: string,
  id: string,
  input: MapPinUpdateInput,
): Promise<MapPin> {
  const { data } = await apiClient.patch<MapPin>(
    `/maps/${mapId}/pins/${id}`,
    input,
  );
  return data;
}

export async function deleteMapPin(mapId: string, id: string): Promise<void> {
  await apiClient.delete(`/maps/${mapId}/pins/${id}`);
}
