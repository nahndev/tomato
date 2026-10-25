import { Module } from '@nestjs/common';
import { DocumentMapper } from './document.mapper';
import { RelationshipMapperRegistry } from './relationship-mapper.registry';
import { RolePermissionMapper } from './role-permission.mapper';
import { UserMapper } from './user.mapper';

@Module({
  providers: [UserMapper, DocumentMapper, RolePermissionMapper, RelationshipMapperRegistry],
  exports: [RelationshipMapperRegistry],
})
export class MapperModule {}
