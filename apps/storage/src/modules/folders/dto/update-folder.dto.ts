import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { IsName, IsUndefinable, NAME_MAX_LENGTH, NAME_MIN_LENGTH, Trim } from '../../../common';

export class UpdateFolderDto {
  @ApiPropertyOptional({ minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })
  @IsUndefinable()
  @Trim()
  @IsName()
  name?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'A folder of the same group, outside this folder' })
  @IsUndefinable()
  @IsUUID()
  parentId?: string;
}
