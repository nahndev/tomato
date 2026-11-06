import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  folderId!: string;
}
