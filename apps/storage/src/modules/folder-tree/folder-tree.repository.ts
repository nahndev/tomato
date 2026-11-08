import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';

@Injectable()
export class FolderTreeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPathToRoot(folderId: string): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      WITH RECURSIVE path AS (
        SELECT id, parent_id, 0 AS depth FROM folders WHERE id = ${folderId}::uuid
        UNION ALL
        SELECT parent.id, parent.parent_id, path.depth + 1
        FROM folders parent JOIN path ON parent.id = path.parent_id
      )
      SELECT id::text FROM path ORDER BY depth
    `;
    return rows.map(({ id }) => id);
  }

  async findSubtreeIds(folderId: string): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      WITH RECURSIVE subtree AS (
        SELECT id FROM folders WHERE id = ${folderId}::uuid
        UNION ALL
        SELECT child.id FROM folders child JOIN subtree ON child.parent_id = subtree.id
      )
      SELECT id::text FROM subtree
    `;
    return rows.map(({ id }) => id);
  }
}
