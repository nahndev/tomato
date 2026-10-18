import { describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import type { StorageService } from '../storage/storage.service';
import { CollabService } from './collab.service';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const DOCUMENT_NAME = `template/${TEMPLATE_ID}`;

function createCollabService(state: Uint8Array | null = null) {
  const storage = { load: vi.fn().mockResolvedValue(state), save: vi.fn() };
  return { storage, document: new CollabService(storage as unknown as StorageService) };
}

describe('CollabService', () => {
  it('loads an empty document when nothing is stored', async () => {
    const { document, storage } = createCollabService();

    const doc = await document.load(DOCUMENT_NAME);

    expect(storage.load).toHaveBeenCalledWith(DOCUMENT_NAME);
    expect(doc.getText('name').toString()).toBe('');
  });

  it('restores the stored state', async () => {
    const source = new Y.Doc();
    source.getText('name').insert(0, 'Leave request');
    const { document } = createCollabService(Y.encodeStateAsUpdate(source));

    expect((await document.load(DOCUMENT_NAME)).getText('name').toString()).toBe('Leave request');
  });

  it('saves the encoded state', async () => {
    const { document, storage } = createCollabService();
    const doc = new Y.Doc();
    doc.getText('name').insert(0, 'Leave request');

    await document.save(DOCUMENT_NAME, doc);

    expect(storage.save).toHaveBeenCalledWith(DOCUMENT_NAME, Y.encodeStateAsUpdate(doc));
  });

  it('rejects names that are not template documents', async () => {
    const { document } = createCollabService();

    await expect(document.load('other/x')).rejects.toThrow();
    await expect(document.load('template/not-a-uuid')).rejects.toThrow();
    await expect(document.load(`template/${TEMPLATE_ID}/../x`)).rejects.toThrow();
    await expect(document.save('other/x', new Y.Doc())).rejects.toThrow();
  });
});
