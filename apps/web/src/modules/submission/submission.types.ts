import type { Submission } from "@/modules/board";
import type { SubmissionDependency } from "@/modules/submission-dependency";
import type { TemplateVersion } from "@/shared/types/template.types";
import type { SubmissionTreeNodeKind } from "./submission.constants";

export interface SubmissionTreeNode {
  id: string;
  kind: SubmissionTreeNodeKind;
  depth: number;
  edge: SubmissionDependency | null;
  children: SubmissionTreeNode[];
}

export type SubmissionDetail = Omit<Submission, "templateVersion"> & { templateVersion: TemplateVersion };
