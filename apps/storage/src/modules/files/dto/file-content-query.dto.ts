import { ApiPropertyOptional } from '@nestjs/swagger';
import { ImageVariant } from '@tomato/constants';
import { IsIn, IsOptional } from 'class-validator';

export class FileContentQueryDto {
  @ApiPropertyOptional({
    enum: Object.values(ImageVariant),
    description: 'A scaled copy of an image; the original when it is not an image or the copy is not ready',
  })
  @IsOptional()
  @IsIn(Object.values(ImageVariant))
  variant?: ImageVariant;
}
