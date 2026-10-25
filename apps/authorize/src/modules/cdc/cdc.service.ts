import { Injectable, Logger } from '@nestjs/common';
import { SpiceDbService } from '../spicedb/spicedb.service';
import type { CdcTable } from './cdc.constants';
import { mapChange } from './cdc.mapper';
import { changeEventSchema } from './cdc.types';

@Injectable()
export class CdcService {
  private readonly logger = new Logger(CdcService.name);

  constructor(private readonly spiceDb: SpiceDbService) {}

  async sync(table: CdcTable, payload: unknown) {
    if (!payload) return;

    const relationships = mapChange(table, changeEventSchema.parse(payload));
    await this.spiceDb.touchRelationships(relationships);
    if (relationships.length > 0) this.logger.log(`${table}: wrote ${relationships.length} relationship(s)`);
  }
}
