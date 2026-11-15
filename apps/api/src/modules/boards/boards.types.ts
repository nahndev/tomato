import type { DisplayType, TaskConditionOperation, ValueType } from '@tomato/constants';
import type {
  Board,
  BoardAgenda,
  BoardTable,
  BoardTask,
  BoardTemplate,
  BoardTemplateTaskSetting,
  Template,
} from '../../generated/prisma/client';
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

/** `versions` holds only the newest published version, empty until the template is published. */
export type BoardTemplateEntity = BoardTemplate & { template: Template & { versions: TemplateVersionEntity[] } };

export type BoardTableEntity = Omit<BoardTable, 'columns'> & { columns: BoardColumn[] };

export interface BoardTaskCondition {
  widget: string;
  operation: TaskConditionOperation;
  value: string;
}

export type BoardTaskSettingEntity = Omit<BoardTemplateTaskSetting, 'conditions'> & { conditions: BoardTaskCondition[] };

export type BoardTaskEntity = BoardTask & { settings: BoardTaskSettingEntity[] };

export type BoardEntity = Board & {
  templates: BoardTemplateEntity[];
  table: BoardTableEntity | null;
  task: BoardTaskEntity | null;
  agenda: BoardAgenda | null;
};

export type BoardListEntity = Board & { _count: { templates: number } };

export interface BoardWriteData {
  name?: string;
  templateIds?: string[];
  columns?: BoardColumn[];
}
