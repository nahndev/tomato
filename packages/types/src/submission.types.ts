import type { DisplayBucket } from '@tomato/constants';
import type { TemplateVersion } from './template-editor.types';

export type SubmissionDisplayValue = Partial<Record<DisplayBucket, unknown>>;

/** widgetId → value property → display buckets */
export type SubmissionDisplayDoc = Record<string, Record<string, SubmissionDisplayValue>>;

export interface Submission {
  id: string;
  boardId: string;
  templateId: string;
  templateVersionId: string;
  data: Record<string, unknown>;
  dataDisplays: SubmissionDisplayDoc;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionDetail extends Submission {
  templateVersion: TemplateVersion;
}

export interface SubmissionValueEntry {
  value: unknown;
  clock: number;
}

export type SubmissionValueEntries = Record<string, SubmissionValueEntry>;
