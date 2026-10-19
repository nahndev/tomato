import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type {
  PaginatedResponse,
  Submission,
  SubmissionDetail,
  SubmissionValueEntries,
  TemplateSnapshot,
} from '@tomato/types';
import type { PaginationQueryDto } from '../../common';
import type { CreateSubmissionDto } from './dto/create-submission.dto';
import { buildDisplayDoc } from './display/submission-display.mapper';
import { toSubmission, toSubmissionDetail } from './submissions.mapper';
import { SubmissionsRepository } from './submissions.repository';

@Injectable()
export class SubmissionsService {
  constructor(private readonly repository: SubmissionsRepository) {}

  async list(boardId: string, { page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<Submission>> {
    const { items, total } = await this.repository.findMany(boardId, (page - 1) * pageSize, pageSize);
    return { items: items.map(toSubmission), total, page, pageSize };
  }

  async get(id: string): Promise<SubmissionDetail> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return toSubmissionDetail(entity);
  }

  /** Fills in the newest published version of a template linked to the board. */
  async create({ boardId, templateId }: CreateSubmissionDto): Promise<Submission> {
    const link = await this.repository.findLinkedTemplate(boardId, templateId);
    if (!link) throw new BadRequestException({ details: { templateId: [ErrorCode.NOT_FOUND] } });

    const [version] = link.template.versions;
    if (!version) throw new ConflictException();

    const createdAt = new Date();
    const snapshot = version.snapshot as unknown as TemplateSnapshot;
    return toSubmission(
      await this.repository.create(boardId, version.id, createdAt, buildDisplayDoc({}, createdAt, snapshot)),
    );
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  /** Merges values synced from the collab server; a key is rewritten only when its clock changed. */
  async applyValues(id: string, values: SubmissionValueEntries): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();

    const snapshot = entity.templateVersion.snapshot as unknown as TemplateSnapshot;
    const data = { ...(entity.data as Record<string, unknown>) };
    const dataClocks = { ...(entity.dataClocks as Record<string, number>) };

    let hasChanged = false;
    for (const [widgetId, { value, clock }] of Object.entries(values)) {
      if (!(widgetId in snapshot.widgets) || dataClocks[widgetId] === clock) continue;
      data[widgetId] = value;
      dataClocks[widgetId] = clock;
      hasChanged = true;
    }
    if (!hasChanged) return;

    await this.repository.updateValues(id, {
      data,
      dataClocks,
      dataDisplays: buildDisplayDoc(data, entity.createdAt, snapshot),
    });
  }
}
