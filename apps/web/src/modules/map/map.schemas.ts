import type { MapValue } from "./map.types";
import { z } from "zod";
import { MAP_NAME_MAX_LENGTH } from "./map.constants";

export const mapSchema = z.object({
  name: z.string().trim().min(1).max(MAP_NAME_MAX_LENGTH),
});

export type MapInput = z.infer<typeof mapSchema>;
export type MapUpdateInput = Partial<MapInput> & { value?: MapValue };
