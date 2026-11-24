import { describe, expect, it } from 'vitest';
import { normalizeHexColor } from './hex-color';

describe('normalizeHexColor', () => {
  it.each([
    ['#22c55e', '#22c55e'],
    ['#22C55E', '#22c55e'],
    ['#abc', '#aabbcc'],
    ['#ABCDEF80', '#abcdef'],
    ['rgb(1, 2, 3)', '#010203'],
    ['red', '#ff0000'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizeHexColor(input)).toBe(expected);
  });

  it.each([['not-a-color'], [''], ['#abcde'], [null], [undefined], [123], [{}], [[]]])('rejects %j', (input) => {
    expect(normalizeHexColor(input)).toBeNull();
  });
});
