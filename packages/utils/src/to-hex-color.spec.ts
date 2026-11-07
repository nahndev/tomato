import { describe, expect, it } from 'vitest';
import { toHexColor } from './to-hex-color';

describe('toHexColor', () => {
  it.each([
    ['#22c55e', '#22c55e'],
    ['#22C55E', '#22c55e'],
    ['#abc', '#aabbcc'],
    ['#ABCDEF80', '#abcdef'],
    ['rgb(1, 2, 3)', '#010203'],
    ['red', '#ff0000'],
  ])('converts %s', (input, expected) => {
    expect(toHexColor(input)).toBe(expected);
  });

  it.each([['not-a-color'], [''], ['#abcde'], [null], [undefined], [123], [{}], [[]]])('rejects %j', (input) => {
    expect(toHexColor(input)).toBeNull();
  });
});
