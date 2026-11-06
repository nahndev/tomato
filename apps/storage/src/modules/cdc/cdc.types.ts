import { z } from 'zod';

export const insertEventSchema = z.object({
  op: z.string(),
  after: z.object({ id: z.uuid() }).nullable().optional(),
});
