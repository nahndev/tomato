import type { PermissionFlag } from "./permissions.constants";

export type PermissionFlags = Partial<Record<PermissionFlag, boolean>>;
