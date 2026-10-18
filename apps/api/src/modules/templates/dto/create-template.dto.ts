import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common';
import {
  TEMPLATE_DESCRIPTION_MAX_LENGTH,
  TEMPLATE_NAME_MAX_LENGTH,
  TEMPLATE_PREVIEW_IMAGE_URL_MAX_LENGTH,
} from '../templates.constants';

export class CreateTemplateDto {
  @ApiProperty({ minLength: 1, maxLength: TEMPLATE_NAME_MAX_LENGTH })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(TEMPLATE_NAME_MAX_LENGTH)
  name!: string;

  @ApiPropertyOptional({ maxLength: TEMPLATE_DESCRIPTION_MAX_LENGTH })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(TEMPLATE_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @ApiPropertyOptional({ minLength: 1, maxLength: TEMPLATE_PREVIEW_IMAGE_URL_MAX_LENGTH })
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(TEMPLATE_PREVIEW_IMAGE_URL_MAX_LENGTH)
  previewImageUrl?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
