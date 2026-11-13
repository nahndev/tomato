import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { DependencyGraphValueProvider } from "../components/dependency-graph-provider";
import type { DependencyGraphValue, SubmissionDependency } from "../submission-dependency.types";
import { useDependenciesByRefer } from "./use-dependencies-by-refer";
import { useDependency, useHasDependency } from "./use-dependency";
import { useDependencySourceId } from "./use-dependency-source-id";

function edge(sourceId: string, refer: string, idempotencyKey: string): SubmissionDependency {
  return { sourceId, refer, idempotencyKey, targetId: `t-${idempotencyKey}` } as SubmissionDependency;
}

const EDGES = [edge("s1", "s1:w1", "s1:w1:ada"), edge("s1", "s1:w2", "s1:w2:bob"), edge("s2", "s1:w1", "s1:w1:cid")];

function renderWith<T>(hook: () => T, value: Partial<DependencyGraphValue> | null) {
  const wrapper = ({ children }: { children: ReactNode }) =>
    value
      ? createElement(
          DependencyGraphValueProvider,
          { sourceId: "s1", graph: { nodes: [], edges: EDGES }, ...value },
          children,
        )
      : children;
  return renderHook(hook, { wrapper });
}

describe("dependency hooks", () => {
  it("lists the source's dependencies of one refer", () => {
    const { result } = renderWith(() => useDependenciesByRefer("s1:w1"), {});

    expect(result.current.map(({ idempotencyKey }) => idempotencyKey)).toEqual(["s1:w1:ada"]);
  });

  it("finds a dependency by its idempotency key", () => {
    expect(renderWith(() => useDependency("s1:w2:bob"), {}).result.current?.targetId).toBe("t-s1:w2:bob");
    expect(renderWith(() => useHasDependency("s1:w1:cid"), {}).result.current).toBe(false);
  });

  it("reads nothing outside a provider", () => {
    expect(renderWith(() => useDependencySourceId(), null).result.current).toBeUndefined();
    expect(renderWith(() => useDependenciesByRefer("s1:w1"), null).result.current).toEqual([]);
  });
});
