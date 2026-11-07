export interface UserAddress {
  street: string;
  city: string;
  postalCode: string | null;
  country: string;
}

export interface UserRoleSummary {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  departmentId: string;
  eid: string | null;
  name: string;
  familyName: string | null;
  email: string;
  tel: string | null;
  avatarFileId: string | null;
  addresses: UserAddress[];
  roleIds: string[];
  roles: UserRoleSummary[];
  createdAt: string;
  updatedAt: string;
}
