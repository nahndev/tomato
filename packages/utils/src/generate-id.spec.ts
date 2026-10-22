import { describe, expect, it } from 'vitest';
import { generateId } from './generate-id';

describe('generateId', () => {
  it('returns a uuid v7', () => {
    expect(generateId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('is sortable by creation time', () => {
    const first = generateId();
    const second = generateId();
    expect(first < second).toBe(true);
  });
});
