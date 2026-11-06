import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { IsName, NAME_MAX_LENGTH, NAME_MIN_LENGTH, Trim } from '../../../common';

export class CreateFolderDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  parentId!: string;

  @ApiProperty({ minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })
  @Trim()
  @IsName()
  name!: string;
}
