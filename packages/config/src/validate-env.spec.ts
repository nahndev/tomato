import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createEnvValidator } from './validate-env';

const validate = createEnvValidator(z.object({ PORT: z.coerce.number().int().positive(), NAME: z.string().min(1) }));

describe('createEnvValidator', () => {
  it('returns the parsed env', () => {
    expect(validate({ PORT: '3000', NAME: 'tomato', EXTRA: 'x' })).toEqual({ PORT: 3000, NAME: 'tomato' });
  });

  it('lists every invalid variable', () => {
    expect(() => validate({ PORT: 'abc' })).toThrow(/Invalid environment variables[\s\S]*PORT[\s\S]*NAME/);
  });
});
