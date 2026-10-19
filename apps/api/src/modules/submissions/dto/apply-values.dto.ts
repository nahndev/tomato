import { ApiProperty } from '@nestjs/swagger';
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

export class ApplyValuesDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'object', properties: { value: {}, clock: { type: 'integer' } } },
  })
  @IsValueEntries()
  values!: Record<string, { value: unknown; clock: number }>;
}
