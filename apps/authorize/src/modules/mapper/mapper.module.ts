import { Module } from '@nestjs/common';
import { DocumentMapper } from './document.mapper';
import { RelationshipMapperRegistry } from './relationship-mapper.registry';
import { RoleMapper } from './role.mapper';
import { RolePermissionMapper } from './role-permission.mapper';
import { UserMapper } from './user.mapper';
import { UserRoleMapper } from './user-role.mapper';

@Module({
  providers: [UserMapper, RoleMapper, DocumentMapper, RolePermissionMapper, UserRoleMapper, RelationshipMapperRegistry],
  exports: [RelationshipMapperRegistry],
})
export class MapperModule {}
