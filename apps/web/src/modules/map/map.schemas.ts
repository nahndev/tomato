import type { MapValue } from "@tomato/types";
import {
  MAP_PIN_DESCRIPTION_MAX_LENGTH,
  MAP_PIN_LABEL_MAX_LENGTH,
} from "@tomato/constants";
import { z } from "zod";
import { MAP_NAME_MAX_LENGTH } from "./map.constants";

export const mapSchema = z.object({
  name: z.string().trim().min(1).max(MAP_NAME_MAX_LENGTH),
});

export const mapPinSchema = z.object({
  label: z.string().trim().min(1).max(MAP_PIN_LABEL_MAX_LENGTH),
  description: z.string().max(MAP_PIN_DESCRIPTION_MAX_LENGTH),
});

export type MapInput = z.infer<typeof mapSchema>;
export type MapPinInput = z.infer<typeof mapPinSchema>;
export type MapUpdateInput = Partial<MapInput> & { value?: MapValue };
