import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ROLE_DESCRIPTION_MAX_LENGTH, RoleStatus } from "@tomato/constants";
import { IsIn, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";
import { IsHexColor, Trim } from "../../../common";
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

  @ApiPropertyOptional({ example: "#22c55e" })
  @ValidateIf((_, value) => value !== undefined)
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({ enum: Object.values(RoleStatus) })
  @ValidateIf((_, value) => value !== undefined)
  @IsIn(Object.values(RoleStatus))
  status?: RoleStatus;
}
