export const UnitTypeName = {
  CLIENT: 'client',
  DEPARTMENT: 'department',
  OFFICE: 'office',
  TEAM: 'team',
} as const;
export type UnitTypeName = (typeof UnitTypeName)[keyof typeof UnitTypeName];
