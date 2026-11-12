import type { SubmissionDependencyType } from "@tomato/constants";
import type { Submission } from "@/modules/board";
import type { TemplateVersion } from "@/modules/template-editor";

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

export type SubmissionDetail = Omit<Submission, "templateVersion"> & { templateVersion: TemplateVersion };
