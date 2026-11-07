import type { RoleStatus } from "@tomato/constants";

export interface RoleUpdateData {
  name?: string;
  description?: string | null;
  color?: string;
  status?: RoleStatus;
}
