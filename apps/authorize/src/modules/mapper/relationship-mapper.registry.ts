import { Injectable } from '@nestjs/common';
import { CdcTable } from '../cdc/cdc.constants';
import { DocumentMapper } from './document.mapper';
import type { RelationshipMapper } from './relationship-mapper.types';
import { RoleMapper } from './role.mapper';
import { RolePermissionMapper } from './role-permission.mapper';
import { UserMapper } from './user.mapper';
import { UserRoleMapper } from './user-role.mapper';

@Injectable()
export class RelationshipMapperRegistry {
  private readonly mappers: Record<CdcTable, RelationshipMapper>;

  constructor(
    user: UserMapper,
    role: RoleMapper,
    document: DocumentMapper,
    rolePermission: RolePermissionMapper,
    userRole: UserRoleMapper,
  ) {
    this.mappers = {
      [CdcTable.USERS]: user,
      [CdcTable.ROLES]: role,
      [CdcTable.DOCUMENTS]: document,
      [CdcTable.ROLE_PERMISSIONS]: rolePermission,
      [CdcTable.USER_ROLES]: userRole,
    };
  }

  get(table: CdcTable): RelationshipMapper {
    return this.mappers[table];
  }
}
