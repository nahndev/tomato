import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import type { SubmissionGraph, SubmissionGraphNode } from './submission-dependencies.types';

@Injectable()
export class SubmissionDependenciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findGraph(submissionId: string): Promise<SubmissionGraph> {
    const nodes = await this.prisma.$queryRaw<SubmissionGraphNode[]>`
      WITH RECURSIVE walk(id) AS (
        SELECT id FROM submissions WHERE id = ${submissionId}::uuid
        UNION
        SELECT next.id
        FROM walk
        CROSS JOIN LATERAL (
          SELECT d.target_id AS id FROM submission_dependencies d WHERE d.source_id = walk.id
          UNION
          SELECT d.source_id FROM submission_dependencies d WHERE d.target_id = walk.id
        ) next
      )
      SELECT id FROM walk ORDER BY id
    `;
    if (!nodes.length) return { nodes, edges: [] };

    const edges = await this.prisma.submissionDependency.findMany({
      where: { sourceId: { in: nodes.map((node) => node.id) } },
      orderBy: { id: 'asc' },
    });
    return { nodes, edges } as unknown as SubmissionGraph;
  }
}
