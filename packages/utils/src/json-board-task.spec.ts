import { describe, expect, it } from 'vitest';
import { JsonBoardTask } from './json-board-task';

const CONDITION = { widget: 'w-status', value: 'done' };

describe('JsonBoardTask', () => {
  it('returns the conditions of a template, or none without a setting', () => {
    const json = new JsonBoardTask({ t1: { conditions: [CONDITION] } });

    expect(json.conditionsOf('t1')).toEqual([CONDITION]);
    expect(json.conditionsOf('t2')).toEqual([]);
    expect(new JsonBoardTask().conditionsOf('t1')).toEqual([]);
  });

  it('keeps only the setting of the given templates', () => {
    const json = new JsonBoardTask({ t1: { conditions: [] }, t2: { conditions: [CONDITION] } });

    expect(json.pick(new Set(['t1'])).setting).toEqual({ t1: { conditions: [] } });
  });
});
