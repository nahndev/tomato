import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  boardId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  templateId!: string;
}
