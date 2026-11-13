import { SubmissionTreeNodeKind } from "../submission.constants";
import type { SubmissionDependency, SubmissionGraph } from "@/modules/submission-dependency";
import type { SubmissionTreeNode } from "../submission.types";

/** An edge `source → target` nests the target (child) under the source (parent). */
export class Graph {
  private readonly nodeIds: string[];
  private readonly titles: Map<string, string>;
  private readonly children = new Map<string, SubmissionDependency[]>();
  private readonly childIds = new Set<string>();

  constructor({ nodes, edges }: SubmissionGraph) {
    this.nodeIds = nodes.map((node) => node.id);
    this.titles = new Map(nodes.map((node) => [node.id, node.title]));
    const order = new Map(this.nodeIds.map((id, index) => [id, index]));

    for (const edge of edges) {
      this.childIds.add(edge.targetId);
      const list = this.children.get(edge.sourceId) ?? [];
      list.push(edge);
      this.children.set(edge.sourceId, list);
    }
    for (const list of this.children.values()) {
      list.sort((a, b) => (order.get(a.targetId) ?? 0) - (order.get(b.targetId) ?? 0));
    }
  }

  toTree(): SubmissionTreeNode[] {
    const visited = new Set<string>();

    const build = (id: string, edge: SubmissionDependency | null, depth: number): SubmissionTreeNode => {
      const title = this.titles.get(id) ?? "";
      if (visited.has(id)) return { id, title, kind: SubmissionTreeNodeKind.REFER, depth, edge, children: [] };
      visited.add(id);
      const children = (this.children.get(id) ?? []).map((child) => build(child.targetId, child, depth + 1));
      return { id, title, kind: SubmissionTreeNodeKind.NODE, depth, edge, children };
    };

    const roots = this.nodeIds.filter((id) => !this.childIds.has(id)).map((id) => build(id, null, 0));
    // Nodes only reachable through a cycle have no root.
    for (const id of this.nodeIds) {
      if (!visited.has(id)) roots.push(build(id, null, 0));
    }
    return roots;
  }
}
