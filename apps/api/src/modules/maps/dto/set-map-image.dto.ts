import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SetMapImageDto {
  @ApiProperty({ format: 'uuid', description: 'Id of an image file in the storage service' })
  @IsUUID()
  fileId!: string;
}
