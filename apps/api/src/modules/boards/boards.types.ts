import type { DisplayType, ValueType } from '@tomato/constants';
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

/** `versions` holds only the newest published version, empty until the template is published. */
export type BoardTemplateEntity = BoardTemplate & { template: Template & { versions: TemplateVersionEntity[] } };

export type BoardEntity = Omit<Board, 'columns'> & { columns: BoardColumn[]; templates: BoardTemplateEntity[] };

export type BoardListEntity = Omit<Board, 'columns'> & { _count: { templates: number } };

export interface BoardWriteData {
  name?: string;
  columns?: BoardColumn[];
  templateIds?: string[];
}
