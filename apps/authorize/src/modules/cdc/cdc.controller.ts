import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CdcTable } from './cdc.constants';
import { CdcService } from './cdc.service';

@Controller()
export class CdcController {
  constructor(private readonly cdc: CdcService) {}

  @EventPattern('tomato.public.users')
  syncUser(@Payload() payload: unknown) {
    return this.cdc.sync(CdcTable.USERS, payload);
  }

  @EventPattern('tomato.public.documents')
  syncDocument(@Payload() payload: unknown) {
    return this.cdc.sync(CdcTable.DOCUMENTS, payload);
  }

  @EventPattern('tomato.public.role_permissions')
  syncRolePermission(@Payload() payload: unknown) {
    return this.cdc.sync(CdcTable.ROLE_PERMISSIONS, payload);
  }
}
