import { ApiProperty } from '@nestjs/swagger';
import { GroupType } from '@tomato/constants';
import { IsIn, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ enum: Object.values(GroupType) })
  @IsIn(Object.values(GroupType))
  type!: GroupType;

  @ApiProperty({ format: 'uuid', description: 'Id of the user or department' })
  @IsUUID()
  uuid!: string;
}
