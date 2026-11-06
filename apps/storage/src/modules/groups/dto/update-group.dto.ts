import { ApiPropertyOptional } from '@nestjs/swagger';
import { GroupType } from '@tomato/constants';
import { IsIn, IsUUID } from 'class-validator';
import { IsUndefinable } from '../../../common';

export class UpdateGroupDto {
  @ApiPropertyOptional({ enum: Object.values(GroupType) })
  @IsUndefinable()
  @IsIn(Object.values(GroupType))
  type?: GroupType;

  @ApiPropertyOptional({ format: 'uuid', description: 'Id of the user or department' })
  @IsUndefinable()
  @IsUUID()
  uuid?: string;
}
