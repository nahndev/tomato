import { z } from 'zod';

const requiredString = z.string().min(1);

export const envSchema = z.object({
  KAFKA_BROKERS: requiredString.transform((value) => value.split(',').map((broker) => broker.trim())),
  KAFKA_GROUP_ID: requiredString,
  SPICEDB_ENDPOINT: requiredString,
  SPICEDB_TOKEN: requiredString,
  SPICEDB_INSECURE: z.stringbool(),
});

export type Env = z.infer<typeof envSchema>;
