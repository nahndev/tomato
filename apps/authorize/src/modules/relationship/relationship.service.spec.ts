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
    await service.replace([], [relationship('reader'), relationship('updater')]);
    expect(writeRelationships).toHaveBeenCalledWith({
      touch: [relationship('reader'), relationship('updater')],
      remove: [],
    });
  });

  it('removes only what the new state no longer has', async () => {
    const { service, writeRelationships } = setup();
    await service.replace(
      [relationship('reader'), relationship('updater')],
      [relationship('reader')],
    );
    expect(writeRelationships).toHaveBeenCalledWith({
      touch: [relationship('reader')],
      remove: [relationship('updater')],
    });
  });

  it('removes everything for a deleted resource', async () => {
    const { service, writeRelationships } = setup();
    await service.replace([relationship('reader')], []);
    expect(writeRelationships).toHaveBeenCalledWith({ touch: [], remove: [relationship('reader')] });
  });
});
