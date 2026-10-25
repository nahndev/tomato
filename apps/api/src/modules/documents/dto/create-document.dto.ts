import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { IsName, NAME_MAX_LENGTH, NAME_MIN_LENGTH, Trim } from '../../../common';
import { DOCUMENT_CONTENT_MAX_LENGTH } from '../documents.constants';

export class CreateDocumentDto {
  @ApiProperty({ minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })
  @Trim()
  @IsName()
  title!: string;

  @ApiPropertyOptional({ maxLength: DOCUMENT_CONTENT_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(DOCUMENT_CONTENT_MAX_LENGTH)
  content?: string;

  @ApiProperty({ format: 'uuid', description: 'A user of the department' })
  @IsUUID()
  ownerId!: string;
}
