import type { Submission, SubmissionDetail, SubmissionDisplayDoc, TemplateSnapshot } from '@tomato/types';
import type { SubmissionDetailEntity, SubmissionEntity } from './submissions.repository';

export function toSubmission(entity: SubmissionEntity): Submission {
  return {
    id: entity.id,
    boardId: entity.boardId,
    templateId: entity.templateVersion.templateId,
    templateVersionId: entity.templateVersionId,
    data: entity.data as Record<string, unknown>,
    dataDisplays: entity.dataDisplays as unknown as SubmissionDisplayDoc,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toSubmissionDetail(entity: SubmissionDetailEntity): SubmissionDetail {
  const { templateVersion } = entity;
  return {
    ...toSubmission(entity),
    templateVersion: {
      id: templateVersion.id,
      templateId: templateVersion.templateId,
      version: templateVersion.version,
      snapshot: templateVersion.snapshot as unknown as TemplateSnapshot,
      createdAt: templateVersion.createdAt.toISOString(),
    },
  };
}
