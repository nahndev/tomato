import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import { GroupsService } from '../groups/groups.service';
import { CdcOperation } from './cdc.constants';
import { groupEventSchema } from './cdc.types';

@Injectable()
export class CdcService {
  constructor(private readonly groupsService: GroupsService) {}

  async syncGroup(type: GroupType, payload: unknown): Promise<void> {
    if (!payload) return;
    const { op, after } = groupEventSchema.parse(payload);
    const isUpsert = op === CdcOperation.CREATE || op === CdcOperation.READ || op === CdcOperation.UPDATE;
    if (!isUpsert || !after) return;
    const label = [after.name, after.family_name].filter(Boolean).join(' ');
    await this.groupsService.upsert({ type, uuid: after.id, label });
  }
}
