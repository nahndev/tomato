import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USER_ADDRESS_FIELD_MAX_LENGTH, USER_POSTAL_CODE_MAX_LENGTH } from '@tomato/constants';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common';

export class UserAddressDto {
  @ApiProperty({ minLength: 1, maxLength: USER_ADDRESS_FIELD_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(USER_ADDRESS_FIELD_MAX_LENGTH)
  street!: string;

  @ApiProperty({ minLength: 1, maxLength: USER_ADDRESS_FIELD_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(USER_ADDRESS_FIELD_MAX_LENGTH)
  city!: string;

  @ApiPropertyOptional({ nullable: true, minLength: 1, maxLength: USER_POSTAL_CODE_MAX_LENGTH })
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(USER_POSTAL_CODE_MAX_LENGTH)
  postalCode?: string | null;

  @ApiProperty({ minLength: 1, maxLength: USER_ADDRESS_FIELD_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(USER_ADDRESS_FIELD_MAX_LENGTH)
  country!: string;
}
