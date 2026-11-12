import type { DisplayBucket } from '@tomato/constants';
import type { Submission } from '../../generated/prisma/client';
import type { SubmissionGraph } from '../submission-dependencies/submission-dependencies.types';
import type { TemplateVersionEntity } from '../template-editor/template-editor.types';

export type SubmissionDisplayValue = Partial<Record<DisplayBucket, unknown>>;

/** widgetId → value property → display buckets */
export type SubmissionDisplayDoc = Record<string, Record<string, SubmissionDisplayValue>>;

export interface SubmissionValueEntry {
  value: unknown;
  clock: number;
}

export type SubmissionValueEntries = Record<string, SubmissionValueEntry>;

type SubmissionValues = Omit<Submission, 'data' | 'dataClocks' | 'dataDisplays'> & {
  data: Record<string, unknown>;
  dataDisplays: SubmissionDisplayDoc;
};

export type SubmissionEntity = SubmissionValues & { templateVersion: { templateId: string } };

export type SubmissionRecordEntity = SubmissionValues & { templateVersion: TemplateVersionEntity };

export type SubmissionDetailEntity = SubmissionRecordEntity & { graph: SubmissionGraph };

export type SubmissionClocksEntity = SubmissionRecordEntity & { dataClocks: Record<string, number> };

export interface SubmissionValuesUpdate {
  data: Record<string, unknown>;
  dataClocks: Record<string, number>;
  dataDisplays: SubmissionDisplayDoc;
}
