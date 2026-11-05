import {
  USER_ADDRESS_FIELD_MAX_LENGTH,
  USER_ADDRESS_MAX_COUNT,
  USER_EID_MAX_LENGTH,
  USER_POSTAL_CODE_MAX_LENGTH,
  USER_TEL_PATTERN,
} from "@tomato/constants";
import { z } from "zod";

const NAME_MAX_LENGTH = 100;

const addressField = z.string().trim().min(1).max(USER_ADDRESS_FIELD_MAX_LENGTH);
const emptyToNull = (value: string) => value || null;

export const userSchema = z.object({
  name: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  email: z.email().max(254),
});

export const userAddressSchema = z.object({
  street: addressField,
  city: addressField,
  postalCode: z.string().trim().max(USER_POSTAL_CODE_MAX_LENGTH).transform(emptyToNull),
  country: addressField,
});

export const userDetailSchema = userSchema.extend({
  eid: z.string().trim().max(USER_EID_MAX_LENGTH).transform(emptyToNull),
  familyName: z.string().trim().max(NAME_MAX_LENGTH).transform(emptyToNull),
  tel: z
    .string()
    .trim()
    .refine((value) => !value || USER_TEL_PATTERN.test(value))
    .transform(emptyToNull),
  addresses: z.array(userAddressSchema).max(USER_ADDRESS_MAX_COUNT),
  roleIds: z.array(z.string()),
});

export type UserInput = z.infer<typeof userSchema>;
export type UserDetailInput = z.output<typeof userDetailSchema>;
export type UserDetailDraft = z.input<typeof userDetailSchema>;
export type UserAddressDraft = z.input<typeof userAddressSchema>;
