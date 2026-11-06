import { z } from 'zod';

const requiredString = z.string().min(1);

export const envSchema = z.object({
  STORAGE_PORT: z.coerce.number().int().positive(),
  DATABASE_URL: requiredString,
  STORAGE_DIR: requiredString,
  KAFKA_BROKERS: requiredString.transform((value) => value.split(',').map((broker) => broker.trim())),
  KAFKA_GROUP_ID: requiredString,
});

export type Env = z.infer<typeof envSchema>;
