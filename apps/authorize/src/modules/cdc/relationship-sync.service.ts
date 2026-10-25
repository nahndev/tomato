import { Injectable } from '@nestjs/common';
import { RelationshipMapperRegistry } from '../mapper/relationship-mapper.registry';
import { RelationshipService } from '../relationship/relationship.service';
import type { CdcTable } from './cdc.constants';
import { changeEventSchema } from './cdc.types';

@Injectable()
export class RelationshipSyncService {
  constructor(
    private readonly mappers: RelationshipMapperRegistry,
    private readonly relationships: RelationshipService,
  ) {}

  async sync(table: CdcTable, payload: unknown) {
    if (!payload) return;

    const { op, before, after } = changeEventSchema.parse(payload);
    const mapper = this.mappers.get(table);
    if (!mapper.supports(op)) return;

    await this.relationships.replace(
      before ? mapper.toRelationships(before) : [],
      after ? mapper.toRelationships(after) : [],
    );
  }
}
