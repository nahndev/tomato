import { z } from 'zod';

export function createEnvValidator<T extends Record<string, unknown>>(schema: z.ZodType<T>) {
  return (raw: Record<string, unknown>): T => {
    const result = schema.safeParse(raw);
    if (!result.success) throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
    return result.data;
  };
}
