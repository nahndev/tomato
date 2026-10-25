import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CdcTable } from './cdc.constants';
import { RelationshipSyncService } from './relationship-sync.service';

@Controller()
export class CdcController {
  constructor(private readonly relationshipSync: RelationshipSyncService) {}

  @EventPattern('tomato.public.users')
  syncUser(@Payload() payload: unknown) {
    return this.relationshipSync.sync(CdcTable.USERS, payload);
  }

  @EventPattern('tomato.public.documents')
  syncDocument(@Payload() payload: unknown) {
    return this.relationshipSync.sync(CdcTable.DOCUMENTS, payload);
  }

  @EventPattern('tomato.public.role_permissions')
  syncRolePermission(@Payload() payload: unknown) {
    return this.relationshipSync.sync(CdcTable.ROLE_PERMISSIONS, payload);
  }
}
