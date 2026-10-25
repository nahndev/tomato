import { ApiProperty } from "@nestjs/swagger";
import {
  IsName,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  Trim,
} from "../../../common";

export class CreateRoleDto {
  @ApiProperty({ minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })
  @Trim()
  @IsName()
  name!: string;
}
