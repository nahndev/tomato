import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty({ format: 'uuid', description: 'Id of a file in the storage service' })
  @IsUUID()
  fileId!: string;
}
