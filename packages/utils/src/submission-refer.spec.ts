import { describe, expect, it } from 'vitest';
import { parseSubmissionIdempotencyKey, toSubmissionIdempotencyKey, toSubmissionRefer } from './submission-refer';

describe('submission refer keys', () => {
  it('builds a refer from the source and widget, and a key from the refer and id', () => {
    const refer = toSubmissionRefer('s1', 'w1');

    expect(refer).toBe('s1:w1');
    expect(toSubmissionIdempotencyKey(refer, 'u1')).toBe('s1:w1:u1');
  });

  it('reads the id back from a key of the same refer only', () => {
    expect(parseSubmissionIdempotencyKey('s1:w1', 's1:w1:u1')).toBe('u1');
    expect(parseSubmissionIdempotencyKey('s1:w1', 's1:w2:u1')).toBeNull();
    expect(parseSubmissionIdempotencyKey('s1:w1', 's1:w1:')).toBeNull();
  });
});
