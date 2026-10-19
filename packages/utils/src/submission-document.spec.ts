import { describe, expect, it } from 'vitest';
import { getSubmissionDocumentName, parseSubmissionDocumentName } from './submission-document';

describe('submission document name', () => {
  it('round-trips a submission id', () => {
    expect(parseSubmissionDocumentName(getSubmissionDocumentName('abc'))).toBe('abc');
  });

  it.each(['', 'submission', 'template/abc', 'submission/abc/extra'])('rejects %j', (name) => {
    expect(parseSubmissionDocumentName(name)).toBeNull();
  });
});
