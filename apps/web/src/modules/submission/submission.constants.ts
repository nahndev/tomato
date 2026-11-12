export const getSubmissionPath = (id: string) => `/submissions/${id}`;

export const SUBMISSION_SHORT_ID_LENGTH = 8;
export const SUBMISSION_GRAPH_SKELETON_ROWS = 5;

export const SubmissionTreeNodeKind = {
  NODE: "node",
  REFER: "refer",
} as const;
export type SubmissionTreeNodeKind = (typeof SubmissionTreeNodeKind)[keyof typeof SubmissionTreeNodeKind];
