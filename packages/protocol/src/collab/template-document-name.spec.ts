import { describe, expect, it } from 'vitest';
import { TemplateDocumentName } from './template-document-name';

describe('TemplateDocumentName', () => {
  it('round-trips a template id', () => {
    expect(TemplateDocumentName.format({ templateId: 'abc' })).toBe('template/abc');
    expect(TemplateDocumentName.parse('template/abc')).toEqual({ templateId: 'abc' });
  });

  it.each(['', 'template', 'template/', 'submission/abc', 'template/abc/extra'])('rejects %j', (name) => {
    expect(TemplateDocumentName.parse(name)).toBeNull();
  });
});
