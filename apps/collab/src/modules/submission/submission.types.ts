export interface SubmissionValueEntry {
  value: unknown;
  clock: number;
}

export type SubmissionValueEntries = Record<string, SubmissionValueEntry>;
