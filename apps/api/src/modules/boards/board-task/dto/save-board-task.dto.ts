import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BoardTaskSettingDto } from './board-task-setting.dto';

export class SaveBoardTaskDto {
  @ApiProperty({ type: [BoardTaskSettingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardTaskSettingDto)
  settings!: BoardTaskSettingDto[];
}
