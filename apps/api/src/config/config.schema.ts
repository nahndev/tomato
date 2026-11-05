import { z } from 'zod';

const requiredString = z.string().min(1);

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: requiredString,
  COLLAB_URL: z.url(),
  UPLOADS_DIR: requiredString,
});

export type Env = z.infer<typeof envSchema>;
