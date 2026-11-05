import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { USER_ADDRESS_MAX_COUNT, USER_EID_MAX_LENGTH, USER_TEL_PATTERN } from '@tomato/constants';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsName, NAME_MAX_LENGTH, NAME_MIN_LENGTH, Trim } from '../../../common';
import { CreateUserDto } from './create-user.dto';
import { UserAddressDto } from './user-address.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ nullable: true, minLength: 1, maxLength: USER_EID_MAX_LENGTH })
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(USER_EID_MAX_LENGTH)
  eid?: string | null;

  @ApiPropertyOptional({ nullable: true, minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })
  @IsOptional()
  @Trim()
  @IsName()
  familyName?: string | null;

  @ApiPropertyOptional({ nullable: true, pattern: USER_TEL_PATTERN.source })
  @IsOptional()
  @Trim()
  @Matches(USER_TEL_PATTERN)
  tel?: string | null;

  @ApiPropertyOptional({ type: [UserAddressDto], maxItems: USER_ADDRESS_MAX_COUNT })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(USER_ADDRESS_MAX_COUNT)
  @ValidateNested({ each: true })
  @Type(() => UserAddressDto)
  addresses?: UserAddressDto[];

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  roleIds?: string[];
}
