import { describe, expect, it } from 'vitest';
import { JsonBoardAgenda } from './json-board-agenda';

const SETTING = { titleWidget: null, startWidget: 'w-start', endWidget: null };

describe('JsonBoardAgenda', () => {
  it('keeps only the setting of the given templates', () => {
    const json = new JsonBoardAgenda({ t1: SETTING, t2: SETTING });

    expect(json.pick(new Set(['t1'])).setting).toEqual({ t1: SETTING });
    expect(new JsonBoardAgenda().pick(new Set(['t1'])).setting).toEqual({});
  });
});
