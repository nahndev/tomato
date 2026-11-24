import { describe, expect, it } from 'vitest';
import {
  buildSubmissionDocumentName,
  buildTemplateDocumentName,
  parseSubmissionDocumentName,
  parseTemplateDocumentName,
} from './collab-document';

describe('template document name', () => {
  it('round-trips a template id', () => {
    expect(buildTemplateDocumentName('abc')).toBe('template/abc');
    expect(parseTemplateDocumentName(buildTemplateDocumentName('abc'))).toBe('abc');
  });

  it.each(['', 'template', 'submission/abc', 'template/abc/extra'])('rejects %j', (name) => {
    expect(parseTemplateDocumentName(name)).toBeNull();
  });
});

describe('submission document name', () => {
  it('round-trips a submission id', () => {
    expect(buildSubmissionDocumentName('abc')).toBe('submission/abc');
    expect(parseSubmissionDocumentName(buildSubmissionDocumentName('abc'))).toBe('abc');
  });

  it.each(['', 'submission', 'template/abc', 'submission/abc/extra'])('rejects %j', (name) => {
    expect(parseSubmissionDocumentName(name)).toBeNull();
  });
});
