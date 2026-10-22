import type { PaginatedResponse, Unit } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { UNIT_LIST_PAGE_SIZE } from "../unit.constants";
import type { UnitInput } from "../unit.schemas";

const UNITS_URL = "/units";

export async function listUnits(): Promise<PaginatedResponse<Unit>> {
  const { data } = await apiClient.get<PaginatedResponse<Unit>>(UNITS_URL, {
    params: { pageSize: UNIT_LIST_PAGE_SIZE },
  });
  return data;
}

export async function createUnit(input: UnitInput): Promise<Unit> {
  const { data } = await apiClient.post<Unit>(UNITS_URL, input);
  return data;
}

export async function updateUnit(id: string, input: Partial<UnitInput>): Promise<Unit> {
  const { data } = await apiClient.patch<Unit>(`${UNITS_URL}/${id}`, input);
  return data;
}

export async function deleteUnit(id: string): Promise<void> {
  await apiClient.delete(`${UNITS_URL}/${id}`);
}
