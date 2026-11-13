import { SubmissionDependencyType } from "@tomato/constants";
import { describe, expect, it } from "vitest";
import { SubmissionTreeNodeKind } from "../submission.constants";
import type { SubmissionDependency } from "@/modules/submission-dependency";
import type { SubmissionTreeNode } from "../submission.types";
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
  return new Graph({ nodes: ids.map((id) => ({ id, title: "" })), edges }).toTree();
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

  it("carries the title of each node", () => {
    const [root] = new Graph({ nodes: [{ id: "a", title: "Intake of Ada" }], edges: [] }).toTree();

    expect(root.title).toBe("Intake of Ada");
  });

  it("starts from sources that are no target and nests their targets", () => {
    const tree = toTree(["a", "b", "c", "d"], [edge("a", "b"), edge("a", "c"), edge("b", "d")]);

    expect(shape(tree)).toEqual([["a", NODE, 0, [["b", NODE, 1, [["d", NODE, 2]]], ["c", NODE, 1]]]]);
    expect(tree[0].children[0].edge?.id).toBe("a-b");
  });

  it("orders roots and children by node order", () => {
    const tree = toTree(["a", "b", "c", "d"], [edge("b", "d"), edge("b", "c")]);

    expect(shape(tree)).toEqual([["a", NODE, 0], ["b", NODE, 0, [["c", NODE, 1], ["d", NODE, 1]]]]);
  });

  it("adds a refer node for a node already loaded and does not expand it", () => {
    const tree = toTree(["a", "b", "c", "d"], [edge("a", "c"), edge("b", "c"), edge("c", "d")]);

    expect(shape(tree)).toEqual([
      ["a", NODE, 0, [["c", NODE, 1, [["d", NODE, 2]]]]],
      ["b", NODE, 0, [["c", REFER, 1]]],
    ]);
  });

  it("renders every node of a cycle without a root", () => {
    const tree = toTree(["a", "b", "c"], [edge("b", "a"), edge("c", "b"), edge("a", "c")]);

    expect(shape(tree)).toEqual([["a", NODE, 0, [["c", NODE, 1, [["b", NODE, 2, [["a", REFER, 3]]]]]]]]);
  });

  it("renders a cycle hanging below a root", () => {
    const tree = toTree(["a", "b", "c"], [edge("a", "b"), edge("b", "c"), edge("c", "b")]);

    expect(shape(tree)).toEqual([["a", NODE, 0, [["b", NODE, 1, [["c", NODE, 2, [["b", REFER, 3]]]]]]]]);
  });
});
