import { z } from 'zod';

const requiredString = z.string().min(1);

export const envSchema = z.object({
  COPILOT_PORT: z.coerce.number().int().positive(),
  CORS_ORIGIN: requiredString,
  GEMINI_AI_KEY: requiredString,
  GEMINI_MODEL: requiredString,
});

export type Env = z.infer<typeof envSchema>;
