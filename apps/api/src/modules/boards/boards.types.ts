import type { DisplayType, TaskConditionOperation, ValueType } from '@tomato/constants';
import type { Board, BoardTemplate, Template } from '../../generated/prisma/client';
import type { TemplateVersionEntity } from '../template-versions/template-versions.types';

export type ColumnSize = { width: number } | { flex: number };

export interface BoardColumnItem {
  widgetId: string;
  property: ValueType;
}

export interface BoardColumn {
  id: string;
  type: DisplayType;
  size: ColumnSize;
  label: string;
  /** templateId → the widget (and value property) shown for that template */
  items: Record<string, BoardColumnItem>;
}

export interface BoardTaskCondition {
  widget: string;
  operation: TaskConditionOperation;
  value: string;
}

export interface BoardTaskSetting {
  typeWidget: string | null;
  titleWidget: string | null;
  statusWidget: string | null;
  assigneeWidget: string | null;
  conditions: BoardTaskCondition[];
}

/** `versions` holds only the newest published version, empty until the template is published. */
export type BoardTemplateEntity = BoardTemplate & { template: Template & { versions: TemplateVersionEntity[] } };

export type BoardEntity = Omit<Board, 'tableSetting' | 'taskSetting' | 'agendaSetting'> & {
  templates: BoardTemplateEntity[];
  tableSetting: BoardColumn[];
  taskSetting: Record<string, BoardTaskSetting>;
  agendaSetting: Record<string, unknown>;
};

export type BoardListEntity = Board & { _count: { templates: number } };

export interface BoardWriteData {
  name?: string;
  templateIds?: string[];
  tableSetting?: BoardColumn[];
  taskSetting?: Record<string, BoardTaskSetting>;
}
