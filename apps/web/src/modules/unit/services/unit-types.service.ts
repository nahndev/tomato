import type { UnitType } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import type { UnitTypeInput } from "../unit.schemas";

const UNIT_TYPES_URL = "/unit-types";

export async function listUnitTypes(): Promise<UnitType[]> {
  const { data } = await apiClient.get<UnitType[]>(UNIT_TYPES_URL);
  return data;
}

export async function createUnitType(input: UnitTypeInput): Promise<UnitType> {
  const { data } = await apiClient.post<UnitType>(UNIT_TYPES_URL, input);
  return data;
}

export async function updateUnitType(id: string, input: UnitTypeInput): Promise<UnitType> {
  const { data } = await apiClient.patch<UnitType>(`${UNIT_TYPES_URL}/${id}`, input);
  return data;
}

export async function deleteUnitType(id: string): Promise<void> {
  await apiClient.delete(`${UNIT_TYPES_URL}/${id}`);
}
