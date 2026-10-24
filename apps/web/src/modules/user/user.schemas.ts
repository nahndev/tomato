import { z } from "zod";

export const userSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
});

export type UserInput = z.infer<typeof userSchema>;
