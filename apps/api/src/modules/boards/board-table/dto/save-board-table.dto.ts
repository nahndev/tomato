import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BoardColumnDto } from './board-column.dto';

export class SaveBoardTableDto {
  @ApiProperty({ type: [BoardColumnDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardColumnDto)
  setting!: BoardColumnDto[];
}
