import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { SaveBoardTaskDto } from './save-board-task.dto';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

const setting = (overrides: object = {}) => ({
  templateId: TEMPLATE_ID,
  typeWidget: 'w-type',
  titleWidget: null,
  statusWidget: 'w-status',
  assigneeWidget: 'w-users',
  conditions: [{ widget: 'w-status', operation: 'is-not', value: 'done' }],
  ...overrides,
});

const checkTask = async (plain: object) => validate(plainToInstance(SaveBoardTaskDto, plain));

describe('SaveBoardTaskDto', () => {
  it('accepts a valid setting', async () => {
    expect(await checkTask({ settings: [setting()] })).toHaveLength(0);
  });

  it('accepts no settings', async () => {
    expect(await checkTask({ settings: [] })).toHaveLength(0);
  });

  it('requires the settings', async () => {
    expect(await checkTask({})).not.toHaveLength(0);
  });

  it.each([
    ['a non-uuid template id', { templateId: 'abc' }],
    ['an empty widget id', { typeWidget: '' }],
    ['missing conditions', { conditions: undefined }],
    ['an unknown operation', { conditions: [{ widget: 'w-status', operation: 'contains', value: 'done' }] }],
    ['an empty condition value', { conditions: [{ widget: 'w-status', operation: 'is', value: '' }] }],
    ['a condition without a widget', { conditions: [{ operation: 'is', value: 'done' }] }],
  ])('rejects a setting with %s', async (_, overrides) => {
    expect(await checkTask({ settings: [setting(overrides)] })).not.toHaveLength(0);
  });
});
