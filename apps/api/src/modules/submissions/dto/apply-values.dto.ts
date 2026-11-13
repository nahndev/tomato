import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { createValidator, isRecord } from '../../../common';

function isValueEntries(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (entry) => isRecord(entry) && 'value' in entry && typeof entry.clock === 'number' && Number.isInteger(entry.clock),
    )
  );
}

const IsValueEntries = createValidator('isValueEntries', isValueEntries);

const VALUE_ENTRIES_SCHEMA = {
  type: 'object',
  additionalProperties: { type: 'object', properties: { value: {}, clock: { type: 'integer' } } },
} as const;

export class ApplyValuesDto {
  @ApiProperty(VALUE_ENTRIES_SCHEMA)
  @IsValueEntries()
  values!: Record<string, { value: unknown; clock: number }>;

  @ApiPropertyOptional(VALUE_ENTRIES_SCHEMA)
  @IsOptional()
  @IsValueEntries()
  meta?: Record<string, { value: unknown; clock: number }>;
}
