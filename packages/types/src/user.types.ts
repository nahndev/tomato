export interface UserAddress {
  street: string;
  city: string;
  postalCode: string | null;
  country: string;
}

export interface User {
  id: string;
  departmentId: string;
  eid: string | null;
  name: string;
  familyName: string | null;
  email: string;
  tel: string | null;
  avatarKey: string | null;
  addresses: UserAddress[];
  roleIds: string[];
  createdAt: string;
  updatedAt: string;
}
