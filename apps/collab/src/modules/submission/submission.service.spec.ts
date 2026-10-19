import { describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import type { SubmissionApiClient } from './submission-api.client';
import { SubmissionService, extractValues } from './submission.service';

const SUBMISSION_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

function createDoc(values: Record<string, unknown> = {}): Y.Doc {
  const doc = new Y.Doc();
  for (const [key, value] of Object.entries(values)) doc.getMap('values').set(key, value);
  return doc;
}

function createService(putValues = vi.fn().mockResolvedValue(undefined)) {
  return { putValues, service: new SubmissionService({ putValues } as unknown as SubmissionApiClient) };
}

describe('extractValues', () => {
  it('returns each value with the clock of the item that set it', () => {
    const doc = createDoc({ name: 'Ada' });
    const first = extractValues(doc).name.clock;

    doc.getMap('values').set('name', 'Grace');

    const { name } = extractValues(doc);
    expect(name.value).toBe('Grace');
    expect(name.clock).toBeGreaterThan(first);
  });

  it('returns nothing for an empty document', () => {
    expect(extractValues(createDoc())).toEqual({});
  });
});

describe('SubmissionService', () => {
  it('pushes the values of a submission document', async () => {
    const { putValues, service } = createService();

    await service.sync(`submission/${SUBMISSION_ID}`, createDoc({ name: 'Ada' }));

    expect(putValues).toHaveBeenCalledWith(SUBMISSION_ID, { name: { value: 'Ada', clock: expect.any(Number) } });
  });

  it('ignores template documents and empty submissions', async () => {
    const { putValues, service } = createService();

    await service.sync(`template/${SUBMISSION_ID}`, createDoc({ name: 'Ada' }));
    await service.sync(`submission/${SUBMISSION_ID}`, createDoc());

    expect(putValues).not.toHaveBeenCalled();
  });

  it('does not fail when the api is unreachable', async () => {
    const { service } = createService(vi.fn().mockRejectedValue(new Error('down')));

    await expect(service.sync(`submission/${SUBMISSION_ID}`, createDoc({ name: 'Ada' }))).resolves.toBeUndefined();
  });
});
