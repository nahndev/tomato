import { z } from 'zod';
import { CdcOperation } from './cdc.constants';

const uuid = z.uuid();

export const userRowSchema = z.object({ id: uuid, department_id: uuid });
export const documentRowSchema = z.object({ id: uuid, department_id: uuid, owner_id: uuid });

export const changeEventSchema = z.object({
  op: z.string(),
  after: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type ChangeEvent = z.infer<typeof changeEventSchema>;

export const isInsertOperation = (op: string) => op === CdcOperation.CREATE || op === CdcOperation.READ;
