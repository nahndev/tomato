import { describe, expect, it } from 'vitest';
import { SubmissionRefer } from './submission-refer';

describe('SubmissionRefer', () => {
  it('round-trips the source and the widget', () => {
    expect(SubmissionRefer.format({ sourceId: 's1', widgetId: 'w1' })).toBe('s1:w1');
    expect(SubmissionRefer.parse('s1:w1')).toEqual({ sourceId: 's1', widgetId: 'w1' });
  });

  it.each(['', 's1', 's1:', ':w1', 's1:w1:u1'])('rejects %j', (refer) => {
    expect(SubmissionRefer.parse(refer)).toBeNull();
  });
});
