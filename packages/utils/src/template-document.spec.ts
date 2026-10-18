import { describe, expect, it } from 'vitest';
import { getTemplateDocumentName, parseTemplateDocumentName } from './template-document';

describe('template document name', () => {
  it('round-trips a template id', () => {
    expect(parseTemplateDocumentName(getTemplateDocumentName('abc'))).toBe('abc');
  });

  it.each(['', 'template', 'submission/abc', 'template/abc/extra'])('rejects %j', (name) => {
    expect(parseTemplateDocumentName(name)).toBeNull();
  });
});
