import { describe, expect, it, vi } from 'vitest';
import type { SpiceDbService } from '../spicedb/spicedb.service';
import type { SpiceDbRelationship } from '../spicedb/spicedb.types';
import { RelationshipService } from './relationship.service';

const relationship = (relation: SpiceDbRelationship['relation']): SpiceDbRelationship => ({
  resource: { type: 'department', id: 'd1' },
  relation,
  subject: { type: 'role', id: 'r1', relation: 'member' },
});

function setup() {
  const writeRelationships = vi.fn().mockResolvedValue(undefined);
  const service = new RelationshipService({ writeRelationships } as unknown as SpiceDbService);
  return { service, writeRelationships };
}

describe('RelationshipService', () => {
  it('touches everything for a new resource', async () => {
    const { service, writeRelationships } = setup();
    await service.replace([], [relationship('document_read'), relationship('document_update')]);
    expect(writeRelationships).toHaveBeenCalledWith({
      touch: [relationship('document_read'), relationship('document_update')],
      remove: [],
    });
  });

  it('removes only what the new state no longer has', async () => {
    const { service, writeRelationships } = setup();
    await service.replace(
      [relationship('document_read'), relationship('document_update')],
      [relationship('document_read')],
    );
    expect(writeRelationships).toHaveBeenCalledWith({
      touch: [relationship('document_read')],
      remove: [relationship('document_update')],
    });
  });

  it('removes everything for a deleted resource', async () => {
    const { service, writeRelationships } = setup();
    await service.replace([relationship('document_read')], []);
    expect(writeRelationships).toHaveBeenCalledWith({ touch: [], remove: [relationship('document_read')] });
  });
});
