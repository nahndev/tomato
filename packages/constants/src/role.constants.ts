export const RoleStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
export type RoleStatus = (typeof RoleStatus)[keyof typeof RoleStatus];

export const ROLE_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
export const ROLE_DESCRIPTION_MAX_LENGTH = 500;
