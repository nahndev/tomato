import type { PaginatedResponse } from "@/shared/types/api.types";
import type { Map } from "../map.types";
import { apiClient } from "@/shared/lib/api-client";
import { MAP_LIST_PAGE_SIZE } from "../map.constants";
import type { MapInput, MapUpdateInput } from "../map.schemas";

export async function listMaps(): Promise<PaginatedResponse<Map>> {
  const { data } = await apiClient.get<PaginatedResponse<Map>>("/maps", {
    params: { pageSize: MAP_LIST_PAGE_SIZE },
  });
  return data;
}

export async function createMap(input: MapInput): Promise<Map> {
  const { data } = await apiClient.post<Map>("/maps", input);
  return data;
}

export async function getMap(id: string): Promise<Map> {
  const { data } = await apiClient.get<Map>(`/maps/${id}`);
  return data;
}

export async function updateMap(
  id: string,
  input: MapUpdateInput,
): Promise<Map> {
  const { data } = await apiClient.patch<Map>(`/maps/${id}`, input);
  return data;
}

export async function deleteMap(id: string): Promise<void> {
  await apiClient.delete(`/maps/${id}`);
}
