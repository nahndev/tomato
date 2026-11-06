import { Injectable } from '@nestjs/common';
import type { GroupType } from '@tomato/constants';
import { GroupsService } from '../groups/groups.service';
import { CdcOperation } from './cdc.constants';
import { insertEventSchema } from './cdc.types';

@Injectable()
export class CdcService {
  constructor(private readonly groupsService: GroupsService) {}

  async seedGroup(type: GroupType, payload: unknown): Promise<void> {
    if (!payload) return;
    const { op, after } = insertEventSchema.parse(payload);
    const isInsert = op === CdcOperation.CREATE || op === CdcOperation.READ;
    if (isInsert && after) await this.groupsService.seed(type, after.id);
  }
}
