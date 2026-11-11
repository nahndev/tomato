import { ApiPropertyOptional } from '@nestjs/swagger';
import type { StorageGroupLimit } from '../groups.types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common';
import { IsGroupLimit } from './is-group-limit.decorator';

function parseLimit({ value }: { value: unknown }): unknown {
  if (value === '') return undefined;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export class ListGroupsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'JSON filter on `type` and `uuid`, with `AND`, `OR` and `NOT`. Empty or null lists every group.',
    example: '{"OR":[{"type":"user"},{"type":"department","uuid":"0190f3a0-0000-7000-8000-000000000000"}]}',
  })
  @IsOptional()
  @Transform(parseLimit)
  @IsGroupLimit()
  limit?: StorageGroupLimit | null;
}
