import { TaskField } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { BoardTaskSettings } from './board-task-setting';

const CONDITION = { widget: 'w-status', value: 'done' };
const ENTRY = { typeWidget: 'w-type', titleWidget: 'w-title', statusWidget: null, assigneeWidget: 'w-users' };

describe('BoardTaskSettings', () => {
  it('returns the conditions of a template, or none without an entry', () => {
    const setting = { t1: { conditions: [CONDITION] } };

    expect(BoardTaskSettings.conditionsOf(setting, 't1')).toEqual([CONDITION]);
    expect(BoardTaskSettings.conditionsOf(setting, 't2')).toEqual([]);
  });

  it('keeps only the entries of the given templates', () => {
    const setting = { t1: { conditions: [] }, t2: { conditions: [CONDITION] } };

    expect(BoardTaskSettings.pick(setting, new Set(['t1']))).toEqual({ t1: { conditions: [] } });
  });

  it('returns the widget of each task field', () => {
    expect(BoardTaskSettings.widgetOf(ENTRY, TaskField.TYPE)).toBe('w-type');
    expect(BoardTaskSettings.widgetOf(ENTRY, TaskField.TITLE)).toBe('w-title');
    expect(BoardTaskSettings.widgetOf(ENTRY, TaskField.STATUS)).toBeNull();
    expect(BoardTaskSettings.widgetOf(ENTRY, TaskField.ASSIGNEE)).toBe('w-users');
    expect(BoardTaskSettings.widgetOf(undefined, TaskField.TITLE)).toBeNull();
  });

  it('maps task changes to the values of their widgets', () => {
    expect(BoardTaskSettings.valuesOf(ENTRY, { type: 'bug', title: 'Fix login', assignee: ['u1'] })).toEqual({
      'w-type': 'bug',
      'w-title': 'Fix login',
      'w-users': ['u1'],
    });
  });

  it('skips a field without a widget or without a value', () => {
    expect(BoardTaskSettings.valuesOf(ENTRY, { status: 'done', title: undefined })).toEqual({});
    expect(BoardTaskSettings.valuesOf(undefined, { title: 'Fix login' })).toEqual({});
  });
});
