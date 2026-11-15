import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common';
import { BOARD_NAME_MAX_LENGTH } from '../boards.constants';

export class CreateBoardDto {
  @ApiProperty({ minLength: 1, maxLength: BOARD_NAME_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(BOARD_NAME_MAX_LENGTH)
  name!: string;

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  templateIds?: string[];
}
