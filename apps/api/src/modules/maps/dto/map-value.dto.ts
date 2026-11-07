import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  MAP_FRAME_MAX_SIZE,
  MAP_FRAME_MIN_SIZE,
  MAP_IMAGE_RECT_MAX,
  MAP_LAYER_ID_MAX_LENGTH,
  MAP_LAYER_MAX_COUNT,
  MAP_PIN_DESCRIPTION_MAX_LENGTH,
  MAP_PIN_LABEL_MAX_LENGTH,
  MapLayerType,
} from '@tomato/constants';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
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
import { Trim } from '../../../common';
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
}

export type AnyMapLayerDto = MapImageLayerDto | MapPinLayerDto;

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

@ApiExtraModels(MapImageLayerDto, MapPinLayerDto)
export class MapValueDto {
  @ApiProperty({ type: MapFrameDto, required: false, description: 'Frame size in pixels, `MAP_FRAME_DEFAULT_SIZE` when missing' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MapFrameDto)
  frame?: MapFrameDto;

  @ApiProperty({
    description: 'Images drawn in order, pins above them',
    maxItems: MAP_LAYER_MAX_COUNT,
    type: 'array',
    items: { oneOf: [{ $ref: getSchemaPath(MapImageLayerDto) }, { $ref: getSchemaPath(MapPinLayerDto) }] },
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
