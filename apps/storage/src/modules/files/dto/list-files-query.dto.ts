import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsUUID } from 'class-validator';
import { FILES_MAX_IDS } from '../files.constants';

function parseIds({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  return value === '' ? [] : value.split(',').map((id) => id.trim());
}

export class ListFilesQueryDto {
  @ApiProperty({ type: String, description: `Comma-separated file ids, up to ${FILES_MAX_IDS}` })
  @Transform(parseIds)
  @IsArray()
  @ArrayMaxSize(FILES_MAX_IDS)
  @IsUUID('all', { each: true })
  ids!: string[];
}
