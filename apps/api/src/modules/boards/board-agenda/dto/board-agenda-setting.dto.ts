import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class BoardAgendaSettingDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  templateId!: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  titleWidget?: string | null;

  @ApiProperty({ description: 'Date, datetime or created-at widget id' })
  @IsString()
  @MinLength(1)
  startWidget!: string;

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  endWidget?: string | null;
}
