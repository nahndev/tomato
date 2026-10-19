import { describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import type { CollabGateway } from '../collab/collab.gateway';
import { TemplateService, toTemplateSnapshot } from './template.service';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

function createDoc(): Y.Doc {
  const doc = new Y.Doc();
  doc.getText('name').insert(0, 'Leave request');
  doc.getMap('widgets').set('w1', { id: 'w1', type: 'text', label: 'Reason' });
  doc.getMap('sessions').set('s1', { id: 's1', name: 'Step 1' });
  doc.getMap('layouts').set('w1', { column: 0, span: 4, idx: 'a0' });
  doc.getMap('widgetToSession').set('w1', 's1');
  return doc;
}

describe('toTemplateSnapshot', () => {
  it('converts the Yjs document into a plain snapshot', () => {
    expect(toTemplateSnapshot(createDoc())).toEqual({
      name: 'Leave request',
      widgets: { w1: { id: 'w1', type: 'text', label: 'Reason' } },
      sessions: { s1: { id: 's1', name: 'Step 1' } },
      layouts: { w1: { column: 0, span: 4, idx: 'a0' } },
      widgetToSession: { w1: 's1' },
    });
  });

  it('returns an empty snapshot for a blank document', () => {
    expect(toTemplateSnapshot(new Y.Doc())).toEqual({
      name: '',
      widgets: {},
      sessions: {},
      layouts: {},
      widgetToSession: {},
    });
  });
});

describe('TemplateService', () => {
  it('reads the live template document', async () => {
    const readDocument = vi.fn((_name: string, read: (doc: Y.Doc) => unknown) => Promise.resolve(read(createDoc())));
    const service = new TemplateService({ readDocument } as unknown as CollabGateway);

    const snapshot = await service.getSnapshot(TEMPLATE_ID);

    expect(readDocument).toHaveBeenCalledWith(`template/${TEMPLATE_ID}`, toTemplateSnapshot);
    expect(snapshot.name).toBe('Leave request');
  });
});
