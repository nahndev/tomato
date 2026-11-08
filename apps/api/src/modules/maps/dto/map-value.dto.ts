import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  MAP_FRAME_MAX_SIZE,
  MAP_FRAME_MIN_SIZE,
  MAP_IMAGE_RECT_MAX,
  MAP_LAYER_ID_MAX_LENGTH,
  MAP_LAYER_MAX_COUNT,
  MAP_PIN_DESCRIPTION_MAX_LENGTH,
  MAP_PIN_LABEL_MAX_LENGTH,
  MAP_TEXT_MAX_FONT_SIZE,
  MAP_TEXT_MAX_LENGTH,
  MAP_TEXT_MIN_FONT_SIZE,
  MAP_ZONE_MAX_POINTS,
  MAP_ZONE_MIN_POINTS,
  MapLayerType,
  MapPinIcon,
} from '@tomato/constants';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsHexColor, Trim } from '../../../common';
import {
  MAP_IMAGE_POSITION_MAX,
  MAP_IMAGE_POSITION_MIN,
  MAP_PIN_COORDINATE_MAX,
  MAP_PIN_COORDINATE_MIN,
} from '../maps.constants';

const FINITE = { allowNaN: false, allowInfinity: false };

export class MapLayerDto {
  @ApiProperty({ enum: Object.values(MapLayerType) })
  @IsIn(Object.values(MapLayerType))
  type!: MapLayerType;

  @ApiProperty({ minLength: 1, maxLength: MAP_LAYER_ID_MAX_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(MAP_LAYER_ID_MAX_LENGTH)
  id!: string;

  @ApiProperty({ required: false, description: 'Locked layers cannot be moved or resized' })
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;
}

export class MapImageLayerDto extends MapLayerDto {
  @ApiProperty({ enum: [MapLayerType.IMAGE] })
  @IsIn([MapLayerType.IMAGE])
  declare type: typeof MapLayerType.IMAGE;

  @ApiProperty({ format: 'uuid', description: 'Id of an image file in the storage service' })
  @IsUUID()
  fileId!: string;

  @ApiProperty({ minimum: MAP_IMAGE_POSITION_MIN, maximum: MAP_IMAGE_POSITION_MAX, description: 'Ratio of the frame width' })
  @IsNumber(FINITE)
  @Min(MAP_IMAGE_POSITION_MIN)
  @Max(MAP_IMAGE_POSITION_MAX)
  x!: number;

  @ApiProperty({ minimum: MAP_IMAGE_POSITION_MIN, maximum: MAP_IMAGE_POSITION_MAX, description: 'Ratio of the frame height' })
  @IsNumber(FINITE)
  @Min(MAP_IMAGE_POSITION_MIN)
  @Max(MAP_IMAGE_POSITION_MAX)
  y!: number;

  @ApiProperty({ exclusiveMinimum: true, minimum: 0, maximum: MAP_IMAGE_RECT_MAX, description: 'Ratio of the frame width' })
  @IsNumber(FINITE)
  @IsPositive()
  @Max(MAP_IMAGE_RECT_MAX)
  width!: number;

  @ApiProperty({ exclusiveMinimum: true, minimum: 0, maximum: MAP_IMAGE_RECT_MAX, description: 'Ratio of the frame height' })
  @IsNumber(FINITE)
  @IsPositive()
  @Max(MAP_IMAGE_RECT_MAX)
  height!: number;
}

export class MapPinLayerDto extends MapLayerDto {
  @ApiProperty({ enum: [MapLayerType.PIN] })
  @IsIn([MapLayerType.PIN])
  declare type: typeof MapLayerType.PIN;

  @ApiProperty({ minLength: 1, maxLength: MAP_PIN_LABEL_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(MAP_PIN_LABEL_MAX_LENGTH)
  label!: string;

  @ApiProperty({ maxLength: MAP_PIN_DESCRIPTION_MAX_LENGTH })
  @IsString()
  @MaxLength(MAP_PIN_DESCRIPTION_MAX_LENGTH)
  description!: string;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Ratio of the frame width' })
  @IsNumber(FINITE)
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  x!: number;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Ratio of the frame height' })
  @IsNumber(FINITE)
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  y!: number;

  @ApiProperty({ required: false, example: '#22c55e', description: 'The theme color when missing' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ required: false, enum: Object.values(MapPinIcon), description: '`map-pin` when missing' })
  @IsOptional()
  @IsIn(Object.values(MapPinIcon))
  icon?: MapPinIcon;
}

export class MapPointDto {
  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Ratio of the frame width' })
  @IsNumber(FINITE)
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  x!: number;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Ratio of the frame height' })
  @IsNumber(FINITE)
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  y!: number;
}

export class MapZoneLayerDto extends MapLayerDto {
  @ApiProperty({ enum: [MapLayerType.ZONE] })
  @IsIn([MapLayerType.ZONE])
  declare type: typeof MapLayerType.ZONE;

  @ApiProperty({ minLength: 1, maxLength: MAP_PIN_LABEL_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(MAP_PIN_LABEL_MAX_LENGTH)
  label!: string;

  @ApiProperty({ maxLength: MAP_PIN_DESCRIPTION_MAX_LENGTH })
  @IsString()
  @MaxLength(MAP_PIN_DESCRIPTION_MAX_LENGTH)
  description!: string;

  @ApiProperty({ type: [MapPointDto], minItems: MAP_ZONE_MIN_POINTS, maxItems: MAP_ZONE_MAX_POINTS, description: 'Vertices of a closed polygon' })
  @IsArray()
  @ArrayMinSize(MAP_ZONE_MIN_POINTS)
  @ArrayMaxSize(MAP_ZONE_MAX_POINTS)
  @ValidateNested({ each: true })
  @Type(() => MapPointDto)
  points!: MapPointDto[];

  @ApiProperty({ required: false, example: '#22c55e', description: 'Fill and stroke color, the theme color when missing' })
  @IsOptional()
  @IsHexColor()
  color?: string;
}

export class MapTextLayerDto extends MapLayerDto {
  @ApiProperty({ enum: [MapLayerType.TEXT] })
  @IsIn([MapLayerType.TEXT])
  declare type: typeof MapLayerType.TEXT;

  @ApiProperty({ minLength: 1, maxLength: MAP_TEXT_MAX_LENGTH })
  @IsString()
  @MinLength(1)
  @MaxLength(MAP_TEXT_MAX_LENGTH)
  text!: string;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Left edge, ratio of the frame width' })
  @IsNumber(FINITE)
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  x!: number;

  @ApiProperty({ minimum: MAP_PIN_COORDINATE_MIN, maximum: MAP_PIN_COORDINATE_MAX, description: 'Top edge, ratio of the frame height' })
  @IsNumber(FINITE)
  @Min(MAP_PIN_COORDINATE_MIN)
  @Max(MAP_PIN_COORDINATE_MAX)
  y!: number;

  @ApiProperty({ minimum: MAP_TEXT_MIN_FONT_SIZE, maximum: MAP_TEXT_MAX_FONT_SIZE, description: 'In frame pixels' })
  @IsNumber(FINITE)
  @Min(MAP_TEXT_MIN_FONT_SIZE)
  @Max(MAP_TEXT_MAX_FONT_SIZE)
  fontSize!: number;

  @ApiProperty({ required: false, example: '#22c55e', description: 'The theme color when missing' })
  @IsOptional()
  @IsHexColor()
  color?: string;
}

export class MapArrowLayerDto extends MapLayerDto {
  @ApiProperty({ enum: [MapLayerType.ARROW] })
  @IsIn([MapLayerType.ARROW])
  declare type: typeof MapLayerType.ARROW;

  @ApiProperty({ type: MapPointDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => MapPointDto)
  start!: MapPointDto;

  @ApiProperty({ type: MapPointDto, description: 'The arrow head' })
  @IsDefined()
  @ValidateNested()
  @Type(() => MapPointDto)
  end!: MapPointDto;

  @ApiProperty({ required: false, example: '#22c55e', description: 'The theme color when missing' })
  @IsOptional()
  @IsHexColor()
  color?: string;
}

export type AnyMapLayerDto = MapImageLayerDto | MapPinLayerDto | MapZoneLayerDto | MapTextLayerDto | MapArrowLayerDto;

export class MapTransformDto {
  @ApiProperty()
  @IsNumber(FINITE)
  x!: number;

  @ApiProperty()
  @IsNumber(FINITE)
  y!: number;

  @ApiProperty({ exclusiveMinimum: true, minimum: 0 })
  @IsNumber(FINITE)
  @IsPositive()
  scale!: number;
}

export class MapFrameDto {
  @ApiProperty({ minimum: MAP_FRAME_MIN_SIZE, maximum: MAP_FRAME_MAX_SIZE })
  @IsInt()
  @Min(MAP_FRAME_MIN_SIZE)
  @Max(MAP_FRAME_MAX_SIZE)
  width!: number;

  @ApiProperty({ minimum: MAP_FRAME_MIN_SIZE, maximum: MAP_FRAME_MAX_SIZE })
  @IsInt()
  @Min(MAP_FRAME_MIN_SIZE)
  @Max(MAP_FRAME_MAX_SIZE)
  height!: number;
}

export class MapViewportDto {
  @ApiProperty({ type: MapTransformDto, nullable: true, description: '`null` fits the frame in the viewport' })
  @ValidateIf((_, value) => value !== null)
  @IsDefined()
  @ValidateNested()
  @Type(() => MapTransformDto)
  transform!: MapTransformDto | null;
}

@ApiExtraModels(MapImageLayerDto, MapPinLayerDto, MapZoneLayerDto, MapTextLayerDto, MapArrowLayerDto)
export class MapValueDto {
  @ApiProperty({ type: MapFrameDto, required: false, description: 'Frame size in pixels, `MAP_FRAME_DEFAULT_SIZE` when missing' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MapFrameDto)
  frame?: MapFrameDto;

  @ApiProperty({
    description: 'Drawn in order: images, zones, arrows, texts, then pins',
    maxItems: MAP_LAYER_MAX_COUNT,
    type: 'array',
    items: {
      oneOf: [MapImageLayerDto, MapPinLayerDto, MapZoneLayerDto, MapTextLayerDto, MapArrowLayerDto].map((dto) => ({ $ref: getSchemaPath(dto) })),
    },
  })
  @IsArray()
  @ArrayMaxSize(MAP_LAYER_MAX_COUNT)
  @ArrayUnique((layer: MapLayerDto) => layer.id)
  @ValidateNested({ each: true })
  @Type(() => MapLayerDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { name: MapLayerType.IMAGE, value: MapImageLayerDto },
        { name: MapLayerType.PIN, value: MapPinLayerDto },
        { name: MapLayerType.ZONE, value: MapZoneLayerDto },
        { name: MapLayerType.TEXT, value: MapTextLayerDto },
        { name: MapLayerType.ARROW, value: MapArrowLayerDto },
      ],
    },
  })
  layers!: AnyMapLayerDto[];

  @ApiProperty({ type: MapViewportDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => MapViewportDto)
  viewport!: MapViewportDto;
}
