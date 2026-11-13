import { describe, expect, it } from "vitest";
import { getReferSteps, hasReferChanges } from "./refer-submission";

describe("getReferSteps", () => {
  it("marks each user as created, to create or to delete", () => {
    expect(getReferSteps(["ada", "bob", "ada"], { ada: "/a", cid: "/c" })).toEqual([
      { userId: "ada", href: "/a", status: "created" },
      { userId: "bob", href: undefined, status: "will-create" },
      { userId: "cid", href: "/c", status: "will-delete" },
    ]);
  });

  it("reads a legacy single id as one user", () => {
    expect(getReferSteps("ada")).toEqual([{ userId: "ada", href: undefined, status: "will-create" }]);
  });
});

describe("hasReferChanges", () => {
  it("is false only when every step is created", () => {
    expect(hasReferChanges(getReferSteps(["ada"], { ada: "/a" }))).toBe(false);
    expect(hasReferChanges(getReferSteps([], { ada: "/a" }))).toBe(true);
  });
});
