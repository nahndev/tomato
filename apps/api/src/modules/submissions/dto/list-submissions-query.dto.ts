import { ApiProperty } from '@nestjs/swagger';
import { SUBMISSION_TEMPLATE_IDS_SEPARATOR } from '@tomato/constants';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common';

export class ListSubmissionsQueryDto extends PaginationQueryDto {
  @ApiProperty({ type: String, example: '<uuid>,<uuid>' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.split(SUBMISSION_TEMPLATE_IDS_SEPARATOR) : value,
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  templateIds!: string[];
}
