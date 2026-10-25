import { z } from 'zod';

const uuid = z.uuid();

export const userRowSchema = z.object({ id: uuid, department_id: uuid });
export const documentRowSchema = z.object({ id: uuid, department_id: uuid, owner_id: uuid });

export const rolePermissionRowSchema = z.object({
  department_id: uuid,
  role_id: uuid,
  resource: z.string(),
  can_create: z.boolean(),
  can_read: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
});
