import { ApiProperty } from '@nestjs/swagger';
import { DisplayType } from '@tomato/constants';
import type { BoardColumnItem, ColumnSize } from '@tomato/types';
import { IsIn, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common';
import { BOARD_COLUMN_LABEL_MAX_LENGTH } from '../boards.constants';
import { IsColumnItems, IsColumnSize } from './board-column.validators';

export class BoardColumnDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ enum: Object.values(DisplayType) })
  @IsIn(Object.values(DisplayType))
  type!: DisplayType;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'integer' }, example: { flex: 1 } })
  @IsColumnSize()
  size!: ColumnSize;

  @ApiProperty({ minLength: 1, maxLength: BOARD_COLUMN_LABEL_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(BOARD_COLUMN_LABEL_MAX_LENGTH)
  label!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'object', properties: { widgetId: { type: 'string' }, property: { type: 'string' } } },
  })
  @IsColumnItems()
  items!: Record<string, BoardColumnItem>;
}
