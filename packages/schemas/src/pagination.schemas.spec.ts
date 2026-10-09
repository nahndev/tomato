import { describe, expect, it } from 'vitest';
import { paginationQuerySchema } from './pagination.schemas';

describe('paginationQuerySchema', () => {
  it('applies default values', () => {
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, pageSize: 20 });
  });

  it('coerces strings to numbers', () => {
    expect(paginationQuerySchema.parse({ page: '2', pageSize: '50' })).toEqual({
      page: 2,
      pageSize: 50,
    });
  });

  it('rejects pageSize above the limit', () => {
    expect(paginationQuerySchema.safeParse({ pageSize: 101 }).success).toBe(false);
  });
});
