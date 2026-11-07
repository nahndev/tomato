import type { RoleStatus } from '@tomato/constants';

export interface Role {
  id: string;
  departmentId: string;
  name: string;
  description: string | null;
  color: string;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
}
