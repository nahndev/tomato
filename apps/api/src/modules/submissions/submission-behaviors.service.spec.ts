import { LinkDeleteAction, LinkTargetType, WidgetBehaviorType, WidgetType } from '@tomato/constants';
import { beforeEach, describe, expect, it } from 'vitest';
import type { TemplateSnapshot } from '../template-editor/template-editor.types';
import { SubmissionBehaviorsService } from './submission-behaviors.service';
import { SubmissionValuesService } from './submission-values.service';
import type { SubmissionsRepository } from './submissions.repository';
import type { SubmissionDependenciesService } from '../submission-dependencies/submission-dependencies.service';
import type { ReferTarget } from '../submission-dependencies/submission-dependencies.types';
import type { SubmissionClocksEntity, SubmissionValueEntries } from './submissions.types';
import { ValueChanges } from './value-changes';
import { ApplyChangesContext } from './apply-changes-context';

const SUBMISSION_ID = '0b6f5c1e-2d3a-4e7f-9a8b-1c2d3e4f5a60';
const BOARD_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';
const TARGET_TEMPLATE_ID = '7d1e9a52-0c3b-4f48-8a6e-2b5c9d4e1f70';
const UNLINKED_TEMPLATE_ID = 'c2b6d8f0-3e4a-4c1b-9d7e-5a8f1b2c3d4e';
const TARGET_VERSION_ID = '9e0f1a2b-3c4d-4e5f-8a6b-7c8d9e0f1a2b';
const ADA = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';
const BOB = '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e';
const REFER = `${SUBMISSION_ID}:refer`;

function snapshotReferringTo(templateId: string): TemplateSnapshot {
  return {
    name: 'Request',
    widgets: {
      people: { id: 'people', type: WidgetType.USERS, label: 'Approvers' },
      refer: {
        id: 'refer',
        type: WidgetType.REFER_SUBMISSION,
        label: 'Approvals',
        linkWidgetUuid: 'people',
        linkTemplateUuid: templateId,
      },
    },
    layouts: {},
    widgetToSession: {},
    sessions: {},
    links: {
      refer: {
        [LinkTargetType.WIDGET]: { uuid: 'people', onDelete: LinkDeleteAction.CASCADE },
        [LinkTargetType.TEMPLATE]: { uuid: templateId, onDelete: LinkDeleteAction.NONE },
      },
    },
    behaviors: { refer: [WidgetBehaviorType.REFER_SUBMISSION] },
  };
}

function createEntity(snapshot: TemplateSnapshot, overrides: Partial<SubmissionClocksEntity> = {}) {
  return {
    id: SUBMISSION_ID,
    boardId: BOARD_ID,
    data: {},
    dataClocks: {},
    templateVersion: { snapshot },
    ...overrides,
  } as unknown as SubmissionClocksEntity;
}

interface FakeDependency {
  sourceId: string;
  refer: string;
  idempotencyKey: string;
  templateVersionId: string;
}

class FakeRepository {
  readonly created: FakeDependency[] = [];

  async findLinkedTemplate(boardId: string, templateId: string) {
    if (boardId !== BOARD_ID || templateId !== TARGET_TEMPLATE_ID) return null;
    return { template: { versions: [{ id: TARGET_VERSION_ID }] } };
  }
  async deleteReferencedExcept(sourceId: string, refer: string, idempotencyKeys: string[]) {
    const kept = this.created.filter(
      (dep) => dep.sourceId !== sourceId || dep.refer !== refer || idempotencyKeys.includes(dep.idempotencyKey),
    );
    this.created.splice(0, this.created.length, ...kept);
  }
  async createReferDependencies(sourceId: string, refer: string, idempotencyKeys: string[], target: ReferTarget) {
    const existing = new Set(this.created.map((dep) => dep.idempotencyKey));
    for (const idempotencyKey of idempotencyKeys) {
      if (existing.has(idempotencyKey)) continue;
      this.created.push({ sourceId, refer, idempotencyKey, templateVersionId: target.templateVersionId });
    }
  }
}

describe('SubmissionBehaviorsService', () => {
  let repository: FakeRepository;
  let service: SubmissionBehaviorsService;

  beforeEach(() => {
    repository = new FakeRepository();
    service = new SubmissionBehaviorsService(
      repository as unknown as SubmissionsRepository,
      repository as unknown as SubmissionDependenciesService,
    );
  });

  function apply(entity: SubmissionClocksEntity, values: SubmissionValueEntries) {
    const changes = new ValueChanges(entity, values);
    const context = new ApplyChangesContext(entity);
    new SubmissionValuesService().applyValues(context, changes);
    return service.applyBehaviors(context, changes);
  }

  it('links one empty referenced submission per selected id', async () => {
    const entity = createEntity(snapshotReferringTo(TARGET_TEMPLATE_ID));

    await apply(entity, { people: { value: [ADA, BOB], clock: 1 }, refer: { value: 'a', clock: 2 } });

    expect(repository.created).toEqual([
      { sourceId: SUBMISSION_ID, refer: REFER, idempotencyKey: `${REFER}:${ADA}`, templateVersionId: TARGET_VERSION_ID },
      { sourceId: SUBMISSION_ID, refer: REFER, idempotencyKey: `${REFER}:${BOB}`, templateVersionId: TARGET_VERSION_ID },
    ]);
  });

  it('reads the ids from the stored data when they are not in the push', async () => {
    const entity = createEntity(snapshotReferringTo(TARGET_TEMPLATE_ID), { data: { people: [ADA] } });

    await apply(entity, { refer: { value: 'a', clock: 2 } });

    expect(repository.created.map((dep) => dep.idempotencyKey)).toEqual([`${REFER}:${ADA}`]);
  });

  it('keeps existing links, adds new ids and removes deselected ones', async () => {
    const entity = createEntity(snapshotReferringTo(TARGET_TEMPLATE_ID));
    await apply(entity, { people: { value: [ADA], clock: 1 }, refer: { value: 'a', clock: 2 } });

    await apply(entity, { people: { value: [BOB], clock: 3 }, refer: { value: 'b', clock: 4 } });

    expect(repository.created.map((dep) => dep.idempotencyKey)).toEqual([`${REFER}:${BOB}`]);
  });

  it('removes every referenced submission when no id is selected', async () => {
    const entity = createEntity(snapshotReferringTo(TARGET_TEMPLATE_ID));
    await apply(entity, { people: { value: [ADA, BOB], clock: 1 }, refer: { value: 'a', clock: 2 } });

    await apply(entity, { people: { value: [], clock: 3 }, refer: { value: 'b', clock: 4 } });

    expect(repository.created).toEqual([]);
  });

  it('does nothing when the widget value is unchanged or empty', async () => {
    const entity = createEntity(snapshotReferringTo(TARGET_TEMPLATE_ID), { dataClocks: { refer: 2 } });

    await apply(entity, { people: { value: [ADA], clock: 1 }, refer: { value: 'a', clock: 2 } });
    await apply(createEntity(snapshotReferringTo(TARGET_TEMPLATE_ID)), {
      people: { value: [ADA], clock: 1 },
      refer: { value: null, clock: 3 },
    });

    expect(repository.created).toEqual([]);
  });

  it('skips, without throwing, a template that is not linked to the board', async () => {
    const entity = createEntity(snapshotReferringTo(UNLINKED_TEMPLATE_ID));

    await expect(
      apply(entity, { people: { value: [ADA], clock: 1 }, refer: { value: 'a', clock: 2 } }),
    ).resolves.toBeUndefined();
    expect(repository.created).toEqual([]);
  });
});
