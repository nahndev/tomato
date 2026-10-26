import type { PermissionResource } from "@tomato/constants";
import type { PermissionResourceRef } from "@tomato/types";
import type { PermissionFlag } from "./permissions.constants";

export type PermissionFlags = Partial<Record<PermissionFlag, boolean>>;

export interface PermissionItem {
  resource: PermissionResourceRef;
  label: string;
}

export interface PermissionGroup extends PermissionItem {
  type: PermissionResource;
  items: PermissionItem[];
}
