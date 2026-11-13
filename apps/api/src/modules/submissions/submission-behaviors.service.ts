import { Injectable, Logger } from "@nestjs/common";
import { WidgetBehaviorType } from "@tomato/constants";
import { toSubmissionIdempotencyKey, toSubmissionRefer } from "@tomato/utils";
import { SubmissionDependenciesService } from "../submission-dependencies/submission-dependencies.service";
import type { Widget } from "../template-versions/template-versions.types";
import type { ApplyChangesContext } from "./apply-changes-context";
import { SubmissionsRepository } from "./submissions.repository";
import type { ValueChanges } from "./value-changes";

type BehaviorRunner = (
  context: ApplyChangesContext,
  widget: Widget,
) => Promise<void>;

@Injectable()
export class SubmissionBehaviorsService {
  private readonly logger = new Logger(SubmissionBehaviorsService.name);

  private readonly runners: Record<WidgetBehaviorType, BehaviorRunner> = {
    [WidgetBehaviorType.REFER_SUBMISSION]: (...args) =>
      this.referSubmissions(...args),
  };

  constructor(
    private readonly repository: SubmissionsRepository,
    private readonly dependencies: SubmissionDependenciesService,
  ) {}

  async applyBehaviors(
    context: ApplyChangesContext,
    changes: ValueChanges,
  ): Promise<void> {
    const { behaviors, widgets } = context.getSnapshot();
    for (const [widgetId, types] of Object.entries(behaviors)) {
      const widget = widgets[widgetId];
      if (!widget || !changes.has(widget.id) || !context.getData()[widget.id])
        continue;
      for (const type of types) {
        await this.runners[type](context, widget);
      }
    }
  }

  private async referSubmissions(
    context: ApplyChangesContext,
    widget: Widget,
  ): Promise<void> {
    const ids = context.getArrayValue(widget.linkWidgetUuid);
    const sourceId = context.getId();
    const boardId = context.getBoardId();

    const refer = toSubmissionRefer(sourceId, widget.id);
    const idempotencyKeys = ids.map((id) => toSubmissionIdempotencyKey(refer, String(id)));
    await this.dependencies.deleteReferencedExcept(sourceId, refer, idempotencyKeys);
    if (!idempotencyKeys.length) return;

    const templateId = widget.linkTemplateUuid;
    const boardTemplate = templateId ? await this.repository.findLinkedTemplate(boardId, templateId) : null;
    const [version] = boardTemplate?.template.versions ?? [];
    if (!version) {
      this.logger.warn(`Template ${templateId} is not linked to board ${boardId} or has no published version`);
      return;
    }

    await this.dependencies.createReferDependencies(sourceId, refer, idempotencyKeys, {
      boardId,
      templateVersionId: version.id,
    });
  }
}
