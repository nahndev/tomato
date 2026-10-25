import { Injectable, Logger } from '@nestjs/common';
import { SpiceDbService } from '../spicedb/spicedb.service';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';

const relationshipKey = ({ resource, relation, subject }: SpiceDbRelationship) =>
  `${resource.type}:${resource.id}#${relation}@${subject.type}:${subject.id}#${subject.relation ?? ''}`;

@Injectable()
export class RelationshipService {
  private readonly logger = new Logger(RelationshipService.name);

  constructor(private readonly spiceDb: SpiceDbService) {}

  async replace(before: SpiceDbRelationship[], after: SpiceDbRelationship[]) {
    const kept = new Set(after.map(relationshipKey));
    const remove = before.filter((item) => !kept.has(relationshipKey(item)));

    await this.spiceDb.writeRelationships({ touch: after, remove });
    if (after.length + remove.length > 0)
      this.logger.log(`touched ${after.length}, removed ${remove.length} relationship(s)`);
  }
}
