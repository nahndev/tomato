import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common';
import { UNIT_TYPE_NAME_MAX_LENGTH } from '../unit-types.constants';

export class CreateUnitTypeDto {
  @ApiProperty({ minLength: 1, maxLength: UNIT_TYPE_NAME_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(UNIT_TYPE_NAME_MAX_LENGTH)
  name!: string;
}
