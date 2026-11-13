import { Injectable } from '@nestjs/common';
import { SubmissionDependencyType } from '@tomato/constants';
import { PrismaErrorCode, PrismaService, isPrismaError } from '../../common';
import type { ReferTarget, SubmissionGraph, SubmissionGraphNode } from './submission-dependencies.types';

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
      SELECT walk.id, submissions.title
      FROM walk JOIN submissions ON submissions.id = walk.id
      ORDER BY walk.id
    `;
    if (!nodes.length) return { nodes, edges: [] };

    const edges = await this.prisma.submissionDependency.findMany({
      where: { sourceId: { in: nodes.map((node) => node.id) } },
      orderBy: { id: 'asc' },
    });
    return { nodes, edges } as unknown as SubmissionGraph;
  }

  async deleteReferencedExcept(sourceId: string, refer: string, idempotencyKeys: string[]): Promise<void> {
    await this.prisma.submission.deleteMany({
      where: { dependents: { some: { sourceId, refer, idempotencyKey: { notIn: idempotencyKeys } } } },
    });
  }

  async createReferDependencies(
    sourceId: string,
    refer: string,
    idempotencyKeys: string[],
    { boardId, templateVersionId }: ReferTarget,
  ): Promise<void> {
    const existing = await this.prisma.submissionDependency.findMany({
      where: { sourceId, refer },
      select: { idempotencyKey: true },
    });
    const existingKeys = new Set(existing.map((dependency) => dependency.idempotencyKey));
    for (const idempotencyKey of idempotencyKeys) {
      if (existingKeys.has(idempotencyKey)) continue;
      try {
        await this.prisma.submissionDependency.create({
          data: {
            source: { connect: { id: sourceId } },
            type: SubmissionDependencyType.REFERENCE,
            refer,
            idempotencyKey,
            target: { create: { boardId, templateVersionId } },
          },
        });
      } catch (error) {
        if (!isPrismaError(error, PrismaErrorCode.UNIQUE_VIOLATION)) throw error;
      }
    }
  }
}
