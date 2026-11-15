import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { SaveBoardAgendaDto } from './save-board-agenda.dto';

const TEMPLATE_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

const setting = (overrides: object = {}) => ({
  templateId: TEMPLATE_ID,
  titleWidget: 'w-title',
  startWidget: 'w-start',
  endWidget: null,
  ...overrides,
});

const checkAgenda = async (plain: object) => validate(plainToInstance(SaveBoardAgendaDto, plain));

describe('SaveBoardAgendaDto', () => {
  it('accepts a valid setting', async () => {
    expect(await checkAgenda({ setting: [setting()] })).toHaveLength(0);
  });

  it('accepts an empty setting', async () => {
    expect(await checkAgenda({ setting: [] })).toHaveLength(0);
  });

  it('requires the setting', async () => {
    expect(await checkAgenda({})).not.toHaveLength(0);
  });

  it.each([
    ['a non-uuid template id', { templateId: 'abc' }],
    ['a missing start widget', { startWidget: undefined }],
    ['an empty start widget', { startWidget: '' }],
    ['an empty end widget', { endWidget: '' }],
  ])('rejects a setting with %s', async (_, overrides) => {
    expect(await checkAgenda({ setting: [setting(overrides)] })).not.toHaveLength(0);
  });
});
