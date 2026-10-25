import { z } from 'zod';
import { CdcOperation } from './cdc.constants';

export const changeEventSchema = z.object({
  op: z.string(),
  before: z.record(z.string(), z.unknown()).nullable().optional(),
  after: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type ChangeEvent = z.infer<typeof changeEventSchema>;

export const isInsertOperation = (op: string) => op === CdcOperation.CREATE || op === CdcOperation.READ;
