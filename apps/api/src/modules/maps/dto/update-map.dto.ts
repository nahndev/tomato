import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateMapDto } from './create-map.dto';
import { MapValueDto } from './map-value.dto';

export class UpdateMapDto extends PartialType(CreateMapDto) {
  @ApiPropertyOptional({ type: MapValueDto, description: 'Replaces the whole value' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MapValueDto)
  value?: MapValueDto;
}
