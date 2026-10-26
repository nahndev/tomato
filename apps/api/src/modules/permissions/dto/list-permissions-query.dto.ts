import { ApiPropertyOptional } from "@nestjs/swagger";
import { PermissionResource } from "@tomato/constants";
import { IsIn, IsOptional, IsUUID, Matches } from "class-validator";
import { PaginationQueryDto } from "../../../common";
import { PERMISSION_RESOURCE_ID_PATTERN } from "../permissions.constants";

export class ListPermissionsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional({ enum: Object.values(PermissionResource) })
  @IsOptional()
  @IsIn(Object.values(PermissionResource))
  resourceType?: PermissionResource;

  @ApiPropertyOptional({ example: "all" })
  @IsOptional()
  @Matches(PERMISSION_RESOURCE_ID_PATTERN)
  resourceId?: string;
}
