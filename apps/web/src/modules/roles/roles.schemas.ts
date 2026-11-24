import { ROLE_DESCRIPTION_MAX_LENGTH, RoleStatus } from "@tomato/constants";
import { normalizeHexColor } from "@tomato/protocol";
import { z } from "zod";

const emptyToNull = (value: string) => value || null;

export const roleSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const roleDetailSchema = roleSchema.extend({
  description: z
    .string()
    .trim()
    .max(ROLE_DESCRIPTION_MAX_LENGTH)
    .transform(emptyToNull),
  color: z.string().transform(normalizeHexColor).pipe(z.string()),
  status: z.enum(RoleStatus),
});

export type RoleInput = z.infer<typeof roleSchema>;
export type RoleDetailInput = z.output<typeof roleDetailSchema>;
export type RoleDetailDraft = z.input<typeof roleDetailSchema>;
