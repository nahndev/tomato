import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
