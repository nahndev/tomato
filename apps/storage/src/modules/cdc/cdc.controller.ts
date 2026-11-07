import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GroupType } from '@tomato/constants';
import { CdcService } from './cdc.service';

@Controller()
export class CdcController {
  constructor(private readonly cdcService: CdcService) {}

  @EventPattern('tomato.public.users')
  syncUserGroup(@Payload() payload: unknown) {
    return this.cdcService.syncGroup(GroupType.USER, payload);
  }

  @EventPattern('tomato.public.departments')
  syncDepartmentGroup(@Payload() payload: unknown) {
    return this.cdcService.syncGroup(GroupType.DEPARTMENT, payload);
  }
}
