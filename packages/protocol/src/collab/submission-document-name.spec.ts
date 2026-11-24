import { describe, expect, it } from 'vitest';
import { SubmissionDocumentName } from './submission-document-name';

describe('SubmissionDocumentName', () => {
  it('round-trips a submission id', () => {
    expect(SubmissionDocumentName.format({ submissionId: 'abc' })).toBe('submission/abc');
    expect(SubmissionDocumentName.parse('submission/abc')).toEqual({ submissionId: 'abc' });
  });

  it.each(['', 'submission', 'submission/', 'template/abc', 'submission/abc/extra'])('rejects %j', (name) => {
    expect(SubmissionDocumentName.parse(name)).toBeNull();
  });
});
