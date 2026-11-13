import type { DisplayBucket } from '@tomato/constants';
import type { Submission } from '../../generated/prisma/client';
import type { TemplateVersionEntity } from '../template-versions/template-versions.types';

export type SubmissionDisplayValue = Partial<Record<DisplayBucket, unknown>>;

/** widgetId → value property → display buckets */
export type SubmissionDisplayDoc = Record<string, Record<string, SubmissionDisplayValue>>;

export interface SubmissionValueEntry {
  value: unknown;
  clock: number;
}

export type SubmissionValueEntries = Record<string, SubmissionValueEntry>;

type SubmissionValues = Omit<Submission, 'data' | 'dataClocks' | 'dataDisplays' | 'metaClocks'> & {
  data: Record<string, unknown>;
  dataDisplays: SubmissionDisplayDoc;
};

export type UpdatedSubmissionEntity = Pick<SubmissionValues, 'id' | 'boardId' | 'data' | 'dataDisplays' | 'title' | 'updatedAt'>;

export type SubmissionSummaryPayload = Pick<UpdatedSubmissionEntity, 'id' | 'title' | 'updatedAt'>;

export type SubmissionEntity = SubmissionValues & { templateVersion: { templateId: string } };

export type SubmissionDetailEntity = SubmissionValues & { templateVersion: TemplateVersionEntity };

export type SubmissionClocksEntity = SubmissionDetailEntity & {
  dataClocks: Record<string, number>;
  metaClocks: Record<string, number>;
};

export interface SubmissionValuesUpdate {
  data: Record<string, unknown>;
  dataClocks: Record<string, number>;
  dataDisplays: SubmissionDisplayDoc;
  title: string;
  metaClocks: Record<string, number>;
}
