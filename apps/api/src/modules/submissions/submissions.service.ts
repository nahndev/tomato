import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ErrorCode } from "@tomato/constants";
import type { PaginatedResponse, PaginationQueryDto } from "../../common";
import { buildDisplayDoc } from "./display/submission-display.mapper";
import type { CreateSubmissionDto } from "./dto/create-submission.dto";
import { SubmissionBehaviorsService } from "./submission-behaviors.service";
import { SubmissionMetaService } from "./submission-meta.service";
import { SubmissionValuesService } from "./submission-values.service";
import { SubmissionsRepository } from "./submissions.repository";
import type {
  SubmissionDetailEntity,
  SubmissionEntity,
  SubmissionValueEntries,
} from "./submissions.types";
import { MetaChanges, ValueChanges } from "./value-changes";
import { ApplyChangesContext } from "./apply-changes-context";

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly repository: SubmissionsRepository,
    private readonly behaviors: SubmissionBehaviorsService,
    private readonly values: SubmissionValuesService,
    private readonly meta: SubmissionMetaService,
  ) {}

  async list(
    boardId: string,
    { page, pageSize }: PaginationQueryDto,
  ): Promise<PaginatedResponse<SubmissionEntity>> {
    const { items, total } = await this.repository.findMany(
      boardId,
      (page - 1) * pageSize,
      pageSize,
    );
    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<SubmissionDetailEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create({
    boardId,
    templateId,
  }: CreateSubmissionDto): Promise<SubmissionEntity> {
    const link = await this.repository.findLinkedTemplate(boardId, templateId);
    if (!link)
      throw new BadRequestException({
        details: { templateId: [ErrorCode.NOT_FOUND] },
      });

    const [version] = link.template.versions;
    if (!version) throw new ConflictException();

    const createdAt = new Date();
    return this.repository.create(
      boardId,
      version.id,
      createdAt,
      buildDisplayDoc(new ApplyChangesContext({ createdAt, templateVersion: version })),
    );
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  async applyChanges(
    id: string,
    values: SubmissionValueEntries,
    meta: SubmissionValueEntries = {},
  ): Promise<void> {
    const entity = await this.repository.findWithClocks(id);
    if (!entity) throw new NotFoundException();

    const changes = new ValueChanges(entity, values);
    const metaChanges = new MetaChanges(entity, meta);
    if (changes.isEmpty && metaChanges.isEmpty) return;

    const context = new ApplyChangesContext(entity);
    this.values.applyValues(context, changes);
    this.meta.applyMeta(context, metaChanges);
    await this.behaviors.applyBehaviors(context, changes);

    await this.updateFromContext(context);
  }

  private async updateFromContext(context: ApplyChangesContext): Promise<void> {
    await this.repository.updateValues(context.getId(), {
      data: context.getData(),
      dataClocks: context.getDataClocks(),
      dataDisplays: buildDisplayDoc(context),
      title: context.getTitle(),
      metaClocks: context.getMetaClocks(),
    });
  }
}
