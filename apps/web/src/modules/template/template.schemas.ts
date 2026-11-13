import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
