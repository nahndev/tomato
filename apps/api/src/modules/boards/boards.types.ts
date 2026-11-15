import type { DisplayType, TaskConditionOperation, ValueType } from '@tomato/constants';
import type {
  Board,
  BoardTemplate,
  BoardTemplateTableSetting,
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

export type BoardTableColumn = Omit<BoardColumn, 'items'>;

export type BoardTableSettingEntity = Omit<BoardTemplateTableSetting, 'items'> & {
  /** columnId → the widget (and value property) shown for this template */
  items: Record<string, BoardColumnItem>;
};

export interface BoardTaskCondition {
  widget: string;
  operation: TaskConditionOperation;
  value: string;
}

export type BoardTaskSettingEntity = Omit<BoardTemplateTaskSetting, 'conditions'> & { conditions: BoardTaskCondition[] };

/** `versions` holds only the newest published version, empty until the template is published. */
export type BoardTemplateEntity = BoardTemplate & {
  template: Template & { versions: TemplateVersionEntity[] };
  tableSetting: BoardTableSettingEntity | null;
  taskSetting: BoardTaskSettingEntity | null;
};

export type BoardEntity = Omit<Board, 'tableColumns'> & {
  tableColumns: BoardTableColumn[];
  templates: BoardTemplateEntity[];
};

export type BoardListEntity = Board & { _count: { templates: number } };

export interface BoardWriteData {
  name?: string;
  templateIds?: string[];
}
