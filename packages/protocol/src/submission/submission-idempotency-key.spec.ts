import { describe, expect, it } from 'vitest';
import { SubmissionIdempotencyKey } from './submission-idempotency-key';

describe('SubmissionIdempotencyKey', () => {
  it('round-trips the refer and the id', () => {
    expect(SubmissionIdempotencyKey.format({ refer: 's1:w1', id: 'u1' })).toBe('s1:w1:u1');
    expect(SubmissionIdempotencyKey.parse('s1:w1:u1')).toEqual({ refer: 's1:w1', id: 'u1' });
  });

  it.each(['', 'u1', 's1:w1', 's1:w1:', 's1::u1'])('rejects %j', (key) => {
    expect(SubmissionIdempotencyKey.parse(key)).toBeNull();
  });
});
