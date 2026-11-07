import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  ROLE_COLOR_PATTERN,
  ROLE_DESCRIPTION_MAX_LENGTH,
  RoleStatus,
} from "@tomato/constants";
import { IsIn, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { Trim } from "../../../common";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({
    nullable: true,
    maxLength: ROLE_DESCRIPTION_MAX_LENGTH,
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(ROLE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @ApiPropertyOptional({ pattern: ROLE_COLOR_PATTERN.source })
  @IsOptional()
  @Matches(ROLE_COLOR_PATTERN)
  color?: string;

  @ApiPropertyOptional({ enum: Object.values(RoleStatus) })
  @IsOptional()
  @IsIn(Object.values(RoleStatus))
  status?: RoleStatus;
}
