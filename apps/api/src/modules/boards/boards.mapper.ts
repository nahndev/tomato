import type { Board, BoardColumn, BoardSummary, BoardTemplate, TemplateSnapshot } from '@tomato/types';
import type { BoardEntity, BoardListEntity } from './boards.repository';

function toBoardTemplate({ template }: BoardEntity['templates'][number]): BoardTemplate {
  const [latest] = template.versions;
  return {
    id: template.id,
    name: template.name,
    latestVersion: latest
      ? {
          id: latest.id,
          templateId: latest.templateId,
          version: latest.version,
          snapshot: latest.snapshot as unknown as TemplateSnapshot,
          createdAt: latest.createdAt.toISOString(),
        }
      : null,
  };
}

export function toBoard(entity: BoardEntity): Board {
  return {
    id: entity.id,
    name: entity.name,
    columns: entity.columns as unknown as BoardColumn[],
    templates: entity.templates.map(toBoardTemplate),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toBoardSummary(entity: BoardListEntity): BoardSummary {
  return {
    id: entity.id,
    name: entity.name,
    templateCount: entity._count.templates,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
