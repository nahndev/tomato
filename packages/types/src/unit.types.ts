export interface UnitType {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface Unit {
  id: string;
  name: string;
  isSystem: boolean;
  type: UnitType;
  createdAt: string;
  updatedAt: string;
}
