import { describe, expect, it } from 'vitest';
import { getNextVersion } from './next-version';

describe('getNextVersion', () => {
  it('starts at the initial version', () => {
    expect(getNextVersion(null)).toBe('1.0.0');
  });

  it('bumps the minor version', () => {
    expect(getNextVersion('1.0.0')).toBe('1.1.0');
    expect(getNextVersion('2.9.4')).toBe('2.10.0');
  });

  it('falls back to the initial version for an unknown format', () => {
    expect(getNextVersion('draft')).toBe('1.0.0');
  });
});
