import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BoardAgendaSettingDto } from './board-agenda-setting.dto';

export class SaveBoardAgendaDto {
  @ApiProperty({ type: [BoardAgendaSettingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardAgendaSettingDto)
  setting!: BoardAgendaSettingDto[];
}
