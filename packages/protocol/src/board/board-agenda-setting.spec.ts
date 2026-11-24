import { describe, expect, it } from 'vitest';
import { BoardAgendaSettings } from './board-agenda-setting';

const SETTING = { titleWidget: null, startWidget: 'w-start', endWidget: null };

describe('BoardAgendaSettings', () => {
  it('keeps only the setting of the given templates', () => {
    expect(BoardAgendaSettings.pick({ t1: SETTING, t2: SETTING }, new Set(['t1']))).toEqual({ t1: SETTING });
    expect(BoardAgendaSettings.pick({}, new Set(['t1']))).toEqual({});
  });
});
