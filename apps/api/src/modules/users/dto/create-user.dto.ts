import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';
import { IsName, NAME_MAX_LENGTH, NAME_MIN_LENGTH, Trim } from '../../../common';
import { EMAIL_MAX_LENGTH } from '../users.constants';

export class CreateUserDto {
  @ApiProperty({ minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })
  @Trim()
  @IsName()
  name!: string;

  @ApiProperty({ format: 'email', maxLength: EMAIL_MAX_LENGTH })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(EMAIL_MAX_LENGTH)
  email!: string;
}
