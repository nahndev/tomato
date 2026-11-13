import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { DependencyGraphContext } from "../components/dependency-graph-provider";
import type { DependencyGraphValue, SubmissionDependency } from "../submission-dependency.types";
import { useDependenciesByRefer } from "./use-dependencies-by-refer";
import { useDependency, useHasDependency } from "./use-dependency";
import { useDependencyPolling } from "./use-dependency-polling";
import { useDependencySourceId } from "./use-dependency-source-id";

function edge(sourceId: string, refer: string, idempotencyKey: string): SubmissionDependency {
  return { sourceId, refer, idempotencyKey, targetId: `t-${idempotencyKey}` } as SubmissionDependency;
}

const EDGES = [edge("s1", "s1:w1", "s1:w1:ada"), edge("s1", "s1:w2", "s1:w2:bob"), edge("s2", "s1:w1", "s1:w1:cid")];

function renderWith<T>(hook: () => T, value: Partial<DependencyGraphValue> | null) {
  const context = value && { sourceId: "s1", graph: { nodes: [], edges: EDGES }, requestPolling: () => () => {}, ...value };
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(DependencyGraphContext.Provider, { value: context }, children);
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

  it("asks for polling only while active, and stops it after", () => {
    const stop = vi.fn();
    const requestPolling = vi.fn(() => stop);
    const { rerender } = renderWith(() => useDependencyPolling(false), { requestPolling });
    expect(requestPolling).not.toHaveBeenCalled();

    const active = renderWith(() => useDependencyPolling(true), { requestPolling });
    expect(requestPolling).toHaveBeenCalledTimes(1);

    active.unmount();
    rerender();
    expect(stop).toHaveBeenCalledTimes(1);
  });
});
