import { SubmissionDocKey, SubmissionDocMetaKey } from '@tomato/constants';
import { describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import type { CollabGateway } from '../collab/collab.gateway';
import { SubmissionValuesService } from './submission-values.service';

const SUBMISSION_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

describe('SubmissionValuesService', () => {
  it('sets each value in the submission document', async () => {
    const doc = new Y.Doc();
    doc.getMap(SubmissionDocKey.VALUES).set('w-note', 'kept');
    const updateDocument = vi.fn((_name: string, update: (doc: Y.Doc) => void) => {
      doc.transact(() => update(doc));
      return Promise.resolve();
    });
    const service = new SubmissionValuesService({ updateDocument } as unknown as CollabGateway);

    await service.update(SUBMISSION_ID, { 'w-status': 'done', 'w-users': ['u1'] });

    expect(updateDocument).toHaveBeenCalledWith(`submission/${SUBMISSION_ID}`, expect.any(Function));
    expect(doc.getMap(SubmissionDocKey.VALUES).toJSON()).toEqual({ 'w-note': 'kept', 'w-status': 'done', 'w-users': ['u1'] });
    expect(doc.getMap(SubmissionDocKey.META).get(SubmissionDocMetaKey.UPDATED)).toEqual(expect.any(Number));
  });
});
