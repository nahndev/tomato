import "reflect-metadata";
import { RoleStatus } from "@tomato/constants";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { UpdateRoleDto } from "./update-role.dto";

const parse = (input: object) => {
  const dto = plainToInstance(UpdateRoleDto, input);
  return { dto, errors: validateSync(dto) };
};

describe("UpdateRoleDto", () => {
  it("normalizes a color to lowercase hex", () => {
    const { dto, errors } = parse({ color: "#ABC" });
    expect(errors).toHaveLength(0);
    expect(dto.color).toBe("#aabbcc");
  });

  it.each([["not-a-color"], [null], [123]])("rejects the color %j", (color) => {
    expect(parse({ color }).errors).not.toHaveLength(0);
  });

  it("rejects a null status", () => {
    expect(parse({ status: null }).errors).not.toHaveLength(0);
  });

  it("allows omitting color and status", () => {
    expect(parse({}).errors).toHaveLength(0);
    expect(parse({ status: RoleStatus.INACTIVE }).errors).toHaveLength(0);
  });
});
