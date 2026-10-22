import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().trim().min(1).max(100),
  typeId: z.string().min(1),
});

export type UnitInput = z.infer<typeof unitSchema>;

export const unitTypeSchema = z.object({
  name: z.string().trim().min(1).max(50),
});

export type UnitTypeInput = z.infer<typeof unitTypeSchema>;
