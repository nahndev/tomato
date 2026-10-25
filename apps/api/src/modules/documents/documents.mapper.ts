import type { Document } from '@tomato/types';
import type { Document as DocumentEntity } from '../../generated/prisma/client';

export function toDocument(entity: DocumentEntity): Document {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    ownerId: entity.ownerId,
    title: entity.title,
    content: entity.content,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
