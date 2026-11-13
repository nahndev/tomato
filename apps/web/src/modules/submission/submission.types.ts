import type { SubmissionDependencyType } from "@tomato/constants";
import type { Submission } from "@/modules/board";
import type { TemplateVersion } from "@/shared/types/template.types";
import type { SubmissionTreeNodeKind } from "./submission.constants";

export interface SubmissionDependency {
  id: string;
  sourceId: string;
  targetId: string;
  type: SubmissionDependencyType;
  refer: string | null;
  idempotencyKey: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionGraphNode {
  id: string;
}

export interface SubmissionGraph {
  nodes: SubmissionGraphNode[];
  edges: SubmissionDependency[];
}

export interface SubmissionTreeNode {
  id: string;
  kind: SubmissionTreeNodeKind;
  depth: number;
  edge: SubmissionDependency | null;
  children: SubmissionTreeNode[];
}

export type SubmissionDetail = Omit<Submission, "templateVersion"> & { templateVersion: TemplateVersion };
