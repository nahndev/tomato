import { SubmissionDependencyType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { SubmissionTreeNodeKind } from "../submission.constants";
import type { SubmissionDependency, SubmissionTreeNode } from "../submission.types";
import { Graph } from "./graph";

function edge(sourceId: string, targetId: string): SubmissionDependency {
  return {
    id: `${sourceId}-${targetId}`,
    sourceId,
    targetId,
    type: SubmissionDependencyType.PARENT,
    refer: null,
    idempotencyKey: null,
    meta: {},
    createdAt: "",
    updatedAt: "",
  };
}

function toTree(ids: string[], edges: SubmissionDependency[]) {
  return new Graph({ nodes: ids.map((id) => ({ id })), edges }).toTree();
}

type Shape = [id: string, kind: SubmissionTreeNodeKind, depth: number, children?: Shape[]];

function shape(nodes: SubmissionTreeNode[]): Shape[] {
  return nodes.map(({ id, kind, depth, children }) =>
    children.length ? [id, kind, depth, shape(children)] : [id, kind, depth],
  );
}

const { NODE, REFER } = SubmissionTreeNodeKind;

describe("Graph.toTree", () => {
  it("returns a single root for a node without edges", () => {
    expect(shape(toTree(["a"], []))).toEqual([["a", NODE, 0]]);
  });

  it("starts from nodes without dependencies and nests their dependents", () => {
    const tree = toTree(["a", "b", "c", "d"], [edge("b", "a"), edge("c", "a"), edge("d", "b")]);

    expect(shape(tree)).toEqual([["a", NODE, 0, [["b", NODE, 1, [["d", NODE, 2]]], ["c", NODE, 1]]]]);
    expect(tree[0].children[0].edge?.id).toBe("b-a");
  });

  it("orders roots and children by node order", () => {
    const tree = toTree(["a", "b", "c", "d"], [edge("d", "b"), edge("c", "b")]);

    expect(shape(tree)).toEqual([["a", NODE, 0], ["b", NODE, 0, [["c", NODE, 1], ["d", NODE, 1]]]]);
  });

  it("adds a refer node for a node already loaded and does not expand it", () => {
    const tree = toTree(["a", "b", "c", "d"], [edge("c", "a"), edge("c", "b"), edge("d", "c")]);

    expect(shape(tree)).toEqual([
      ["a", NODE, 0, [["c", NODE, 1, [["d", NODE, 2]]]]],
      ["b", NODE, 0, [["c", REFER, 1]]],
    ]);
  });

  it("renders every node of a cycle without a root", () => {
    const tree = toTree(["a", "b", "c"], [edge("a", "b"), edge("b", "c"), edge("c", "a")]);

    expect(shape(tree)).toEqual([["a", NODE, 0, [["c", NODE, 1, [["b", NODE, 2, [["a", REFER, 3]]]]]]]]);
  });

  it("renders a cycle hanging below a root", () => {
    const tree = toTree(["a", "b", "c"], [edge("b", "a"), edge("c", "b"), edge("b", "c")]);

    expect(shape(tree)).toEqual([["a", NODE, 0, [["b", NODE, 1, [["c", NODE, 2, [["b", REFER, 3]]]]]]]]);
  });
});
