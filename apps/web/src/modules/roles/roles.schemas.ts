import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type RoleInput = z.infer<typeof roleSchema>;
