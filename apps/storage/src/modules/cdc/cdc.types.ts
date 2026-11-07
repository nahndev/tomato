import { z } from 'zod';

export const groupEventSchema = z.object({
  op: z.string(),
  after: z
    .object({ id: z.uuid(), name: z.string(), family_name: z.string().nullable().optional() })
    .nullable()
    .optional(),
});
