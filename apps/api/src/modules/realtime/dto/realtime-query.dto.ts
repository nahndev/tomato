import { ApiProperty } from '@nestjs/swagger';
import { REALTIME_ROOMS_SEPARATOR } from '@tomato/constants';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, Matches } from 'class-validator';
import { REALTIME_ROOM_PATTERN } from '../realtime.constants';

export class RealtimeQueryDto {
  @ApiProperty({ type: String, example: 'submission:<uuid>,board:<uuid>' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.split(REALTIME_ROOMS_SEPARATOR) : value,
  )
  @IsArray()
  @ArrayNotEmpty()
  @Matches(REALTIME_ROOM_PATTERN, { each: true })
  rooms!: string[];
}
