import type { SubmissionDependency } from "@/modules/submission-dependency";
import { describe, expect, it } from "vitest";
import { getPendingReferKeys, getReferSteps } from "./refer-submission";

function dependency(idempotencyKey: string, targetId: string): SubmissionDependency {
  return { idempotencyKey, targetId, refer: "s1:w1", sourceId: "s1" } as SubmissionDependency;
}

const DEPENDENCIES = [dependency("s1:w1:ada", "t-ada"), dependency("s1:w1:cid", "t-cid")];

describe("getReferSteps", () => {
  it("marks each user as created, to create or to delete by its idempotency key", () => {
    expect(getReferSteps("s1:w1", ["ada", "bob", "ada"], DEPENDENCIES)).toEqual([
      { userId: "ada", idempotencyKey: "s1:w1:ada", targetId: "t-ada", status: "created" },
      { userId: "bob", idempotencyKey: "s1:w1:bob", targetId: undefined, status: "will-create" },
      { userId: "cid", idempotencyKey: "s1:w1:cid", targetId: "t-cid", status: "will-delete" },
    ]);
  });

  it("has no step without a refer, as outside a submission", () => {
    expect(getReferSteps(undefined, ["ada"], [])).toEqual([]);
  });
});

describe("getPendingReferKeys", () => {
  it("keeps the keys of steps not created yet", () => {
    expect(getPendingReferKeys(getReferSteps("s1:w1", ["ada"], [dependency("s1:w1:ada", "t")]))).toEqual(new Set());
    expect(getPendingReferKeys(getReferSteps("s1:w1", ["ada", "bob"], DEPENDENCIES))).toEqual(
      new Set(["s1:w1:bob", "s1:w1:cid"]),
    );
  });
});
