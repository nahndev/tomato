import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../../common';

export class AgendaSubmissionsQueryDto extends PaginationQueryDto {
  @ApiProperty({ type: Number, minimum: 0, description: 'Range start (inclusive), epoch milliseconds' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  from!: number;

  @ApiProperty({ type: Number, minimum: 0, description: 'Range end (exclusive), epoch milliseconds' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  to!: number;
}
