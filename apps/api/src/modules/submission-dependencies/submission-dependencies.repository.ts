import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { SUBMISSION_INCLUDE, SUBMISSION_OMIT } from '../submissions/submissions.constants';
import type { SubmissionGraph } from './submission-dependencies.types';

@Injectable()
export class SubmissionDependenciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findGraph(submissionId: string, maxDepth: number): Promise<SubmissionGraph> {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      WITH RECURSIVE walk(id, depth) AS (
        SELECT ${submissionId}::uuid, 0
        UNION
        SELECT next.id, walk.depth + 1
        FROM walk
        CROSS JOIN LATERAL (
          SELECT d.target_id AS id FROM submission_dependencies d WHERE d.source_id = walk.id
          UNION
          SELECT d.source_id FROM submission_dependencies d WHERE d.target_id = walk.id
        ) next
        WHERE walk.depth < ${maxDepth}::int
      )
      SELECT DISTINCT id FROM walk
    `;
    const ids = rows.map((row) => row.id);

    const [nodes, edges] = await this.prisma.$transaction([
      this.prisma.submission.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: 'asc' },
        include: SUBMISSION_INCLUDE,
        omit: SUBMISSION_OMIT,
      }),
      this.prisma.submissionDependency.findMany({
        where: { sourceId: { in: ids }, targetId: { in: ids } },
        orderBy: { createdAt: 'asc' },
      }),
    ]);
    return { nodes, edges } as unknown as SubmissionGraph;
  }
}
