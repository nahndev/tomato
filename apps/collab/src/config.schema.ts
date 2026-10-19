import { z } from 'zod';

export const envSchema = z.object({
  COLLAB_WS_PORT: z.coerce.number().int().positive(),
  COLLAB_HTTP_PORT: z.coerce.number().int().positive(),
  COLLAB_DATA_DIR: z.string().min(1),
  API_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;
