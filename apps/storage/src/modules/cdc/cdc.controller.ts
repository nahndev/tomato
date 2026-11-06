import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GroupType } from '@tomato/constants';
import { CdcService } from './cdc.service';

@Controller()
export class CdcController {
  constructor(private readonly cdcService: CdcService) {}

  @EventPattern('tomato.public.users')
  seedUserGroup(@Payload() payload: unknown) {
    return this.cdcService.seedGroup(GroupType.USER, payload);
  }

  @EventPattern('tomato.public.departments')
  seedDepartmentGroup(@Payload() payload: unknown) {
    return this.cdcService.seedGroup(GroupType.DEPARTMENT, payload);
  }
}
