import { ApiProperty } from "@nestjs/swagger";
import { PermissionResource } from "@tomato/constants";
import { IsIn, Matches } from "class-validator";
import { PERMISSION_RESOURCE_ID_PATTERN } from "../permissions.constants";

export class PermissionResourceDto {
  @ApiProperty({ enum: Object.values(PermissionResource) })
  @IsIn(Object.values(PermissionResource))
  type!: PermissionResource;

  @ApiProperty({ example: "all", description: "Item uuid, or `all`" })
  @Matches(PERMISSION_RESOURCE_ID_PATTERN)
  id!: string;
}
