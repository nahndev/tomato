import { describe, expect, it } from 'vitest';
import {
  createTemplateSchema,
  templateIdSchema,
  updateTemplateSchema,
} from './template.schemas';

describe('createTemplateSchema', () => {
  it('trims the name', () => {
    expect(createTemplateSchema.parse({ name: '  Survey  ' })).toEqual({ name: 'Survey' });
  });

  it('rejects an empty name', () => {
    expect(createTemplateSchema.safeParse({ name: '   ' }).success).toBe(false);
  });

  it('rejects a name above the limit', () => {
    expect(createTemplateSchema.safeParse({ name: 'a'.repeat(101) }).success).toBe(false);
  });
});

describe('updateTemplateSchema', () => {
  it('accepts a partial payload', () => {
    expect(updateTemplateSchema.parse({ description: 'Intro' })).toEqual({ description: 'Intro' });
  });
});

describe('templateIdSchema', () => {
  it('accepts a uuid', () => {
    expect(templateIdSchema.safeParse('3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b').success).toBe(true);
  });

  it('rejects a non-uuid', () => {
    expect(templateIdSchema.safeParse('abc').success).toBe(false);
  });
});
