import { ApiPropertyOptional } from '@nestjs/swagger';
import { GroupType } from '@tomato/constants';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common';

export class ListGroupsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Object.values(GroupType) })
  @IsOptional()
  @IsIn(Object.values(GroupType))
  type?: GroupType;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  uuid?: string;
}
