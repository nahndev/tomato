import { describe, expect, it } from "vitest";
import { getDepartmentNavItems } from "./department-workspace.utils";

describe("getDepartmentNavItems", () => {
  it("builds user and chat links under the department slug", () => {
    expect(getDepartmentNavItems("abc").map((item) => item.href)).toEqual([
      "/department/abc/user",
      "/department/abc/chat",
    ]);
  });
});
