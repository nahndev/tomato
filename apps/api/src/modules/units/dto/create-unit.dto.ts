import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common';
import { UNIT_NAME_MAX_LENGTH } from '../units.constants';

export class CreateUnitDto {
  @ApiProperty({ minLength: 1, maxLength: UNIT_NAME_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(UNIT_NAME_MAX_LENGTH)
  name!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  typeId!: string;
}
