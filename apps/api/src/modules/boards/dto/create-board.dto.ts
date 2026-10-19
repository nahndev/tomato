import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Trim } from '../../../common';
import { BOARD_NAME_MAX_LENGTH } from '../boards.constants';
import { BoardColumnDto } from './board-column.dto';

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

  @ApiPropertyOptional({ type: [BoardColumnDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardColumnDto)
  columns?: BoardColumnDto[];
}
