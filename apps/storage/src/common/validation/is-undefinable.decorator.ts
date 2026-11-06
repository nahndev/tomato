import { ValidateIf } from 'class-validator';

// Unlike IsOptional, rejects null: these columns are not nullable.
export const IsUndefinable = () => ValidateIf((_, value: unknown) => value !== undefined);
