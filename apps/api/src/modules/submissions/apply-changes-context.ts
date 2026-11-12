import { BadRequestException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { TemplateSnapshot, TemplateVersionEntity } from '../template-editor/template-editor.types';
import type { SubmissionClocksEntity } from './submissions.types';

type ApplyChangesSource = Pick<SubmissionClocksEntity, 'createdAt'> &
  Partial<Pick<SubmissionClocksEntity, 'id' | 'boardId' | 'data' | 'dataClocks'>> & {
    templateVersion: Pick<TemplateVersionEntity, 'snapshot'>;
  };

export class ApplyChangesContext {
  private readonly id?: string;
  private readonly boardId?: string;
  private readonly data: Record<string, unknown>;
  private readonly dataClocks: Record<string, number>;
  private readonly createdAt: Date;
  private readonly snapshot: TemplateSnapshot;

  constructor(entity: ApplyChangesSource) {
    this.id = entity.id;
    this.boardId = entity.boardId;
    this.data = { ...entity.data };
    this.dataClocks = { ...entity.dataClocks };
    this.createdAt = entity.createdAt;
    this.snapshot = entity.templateVersion.snapshot;
  }

  getId(): string {
    if (!this.id) throw new Error('ApplyChangesContext has no submission id');
    return this.id;
  }

  getBoardId(): string {
    if (!this.boardId) throw new Error('ApplyChangesContext has no board id');
    return this.boardId;
  }

  setValue(widgetId: string, value: unknown, clock: number): void {
    this.data[widgetId] = value;
    this.dataClocks[widgetId] = clock;
  }

  getData(): Record<string, unknown> {
    return this.data;
  }

  getArrayValue(widgetId: string | undefined): unknown[] {
    if (!widgetId) return [];
    const value = this.data[widgetId];
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
      throw new BadRequestException({ details: { [widgetId]: [ErrorCode.VALIDATION_FAILED] } });
    }
    return value;
  }

  getDataClocks(): Record<string, number> {
    return this.dataClocks;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getSnapshot(): TemplateSnapshot {
    return this.snapshot;
  }
}
