import { SubmissionTreeNodeKind } from "../submission.constants";
import type { SubmissionDependency, SubmissionGraph, SubmissionTreeNode } from "../submission.types";

export class Graph {
  private readonly nodeIds: string[];
  private readonly dependents = new Map<string, SubmissionDependency[]>();
  private readonly dependentIds = new Set<string>();

  constructor({ nodes, edges }: SubmissionGraph) {
    this.nodeIds = nodes.map((node) => node.id);
    const order = new Map(this.nodeIds.map((id, index) => [id, index]));

    for (const edge of edges) {
      this.dependentIds.add(edge.sourceId);
      const list = this.dependents.get(edge.targetId) ?? [];
      list.push(edge);
      this.dependents.set(edge.targetId, list);
    }
    for (const list of this.dependents.values()) {
      list.sort((a, b) => (order.get(a.sourceId) ?? 0) - (order.get(b.sourceId) ?? 0));
    }
  }

  toTree(): SubmissionTreeNode[] {
    const visited = new Set<string>();

    const build = (id: string, edge: SubmissionDependency | null, depth: number): SubmissionTreeNode => {
      if (visited.has(id)) return { id, kind: SubmissionTreeNodeKind.REFER, depth, edge, children: [] };
      visited.add(id);
      const children = (this.dependents.get(id) ?? []).map((child) => build(child.sourceId, child, depth + 1));
      return { id, kind: SubmissionTreeNodeKind.NODE, depth, edge, children };
    };

    const roots = this.nodeIds.filter((id) => !this.dependentIds.has(id)).map((id) => build(id, null, 0));
    // Nodes only reachable through a cycle have no root.
    for (const id of this.nodeIds) {
      if (!visited.has(id)) roots.push(build(id, null, 0));
    }
    return roots;
  }
}
