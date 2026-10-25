import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PermissionResource } from "@tomato/constants";
import { IsBoolean, IsEnum, IsOptional, IsUUID } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ enum: Object.values(PermissionResource) })
  @IsEnum(PermissionResource)
  resource!: PermissionResource;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  canCreate?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  canRead?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  canUpdate?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;
}
