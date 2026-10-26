import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { PermissionResourceDto } from "./permission-resource.dto";

export class CreatePermissionDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ type: PermissionResourceDto })
  @ValidateNested()
  @Type(() => PermissionResourceDto)
  resource!: PermissionResourceDto;

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
