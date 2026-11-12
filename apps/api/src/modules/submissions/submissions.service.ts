import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { PaginatedResponse } from '../../common';
import type { SubmissionValueEntries } from './submissions.types';
import type { PaginationQueryDto } from '../../common';
import type { CreateSubmissionDto } from './dto/create-submission.dto';
import { buildDisplayDoc } from './display/submission-display.mapper';
import { SubmissionDependenciesService } from '../submission-dependencies/submission-dependencies.service';
import { SubmissionsRepository } from './submissions.repository';
import type { SubmissionDetailEntity, SubmissionEntity } from './submissions.types';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly repository: SubmissionsRepository,
    private readonly dependenciesService: SubmissionDependenciesService,
  ) {}

  async list(boardId: string, { page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<SubmissionEntity>> {
    const { items, total } = await this.repository.findMany(boardId, (page - 1) * pageSize, pageSize);
    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<SubmissionDetailEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    const graph = await this.dependenciesService.getGraph(id);
    return { ...entity, graph };
  }

  async create({ boardId, templateId }: CreateSubmissionDto): Promise<SubmissionEntity> {
    const link = await this.repository.findLinkedTemplate(boardId, templateId);
    if (!link) throw new BadRequestException({ details: { templateId: [ErrorCode.NOT_FOUND] } });

    const [version] = link.template.versions;
    if (!version) throw new ConflictException();

    const createdAt = new Date();
    return this.repository.create(boardId, version.id, createdAt, buildDisplayDoc({}, createdAt, version.snapshot));
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  async applyValues(id: string, values: SubmissionValueEntries): Promise<void> {
    const entity = await this.repository.findWithClocks(id);
    if (!entity) throw new NotFoundException();

    const { snapshot } = entity.templateVersion;
    const data = { ...entity.data };
    const dataClocks = { ...entity.dataClocks };

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
