import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MAP_PIN_DESCRIPTION_MAX_LENGTH, MAP_PIN_LABEL_MAX_LENGTH } from '@tomato/constants';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Trim } from '../../../common';
import { MAP_PIN_COORDINATE_MAX, MAP_PIN_COORDINATE_MIN } from '../maps.constants';

export class CreateMapPinDto {
  @ApiProperty({ minLength: 1, maxLength: MAP_PIN_LABEL_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(MAP_PIN_LABEL_MAX_LENGTH)
  label!: string;

  @ApiPropertyOptional({ maxLength: MAP_PIN_DESCRIPTION_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(MAP_PIN_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Ratio of the image width' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  x!: number;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Ratio of the image height' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  y!: number;
}
