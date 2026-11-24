import { TaskField } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { JsonBoardTaskView } from './json-board-task-view';

const SETTING = { typeWidget: 'w-type', titleWidget: 'w-title', statusWidget: null, assigneeWidget: 'w-users' };

describe('JsonBoardTaskView', () => {
  it('returns the widget of each task field', () => {
    expect(JsonBoardTaskView.getTypeWidget(SETTING)).toBe('w-type');
    expect(JsonBoardTaskView.getTitleWidget(SETTING)).toBe('w-title');
    expect(JsonBoardTaskView.getStatusWidget(SETTING)).toBeNull();
    expect(JsonBoardTaskView.getAssigneeWidget(SETTING)).toBe('w-users');
  });

  it('returns the widget of a field by name', () => {
    expect(JsonBoardTaskView.getWidget(SETTING, TaskField.TYPE)).toBe('w-type');
    expect(JsonBoardTaskView.getWidget(SETTING, TaskField.TITLE)).toBe('w-title');
    expect(JsonBoardTaskView.getWidget(SETTING, TaskField.STATUS)).toBeNull();
    expect(JsonBoardTaskView.getWidget(SETTING, TaskField.ASSIGNEE)).toBe('w-users');
  });

  it('returns no widget without a setting', () => {
    expect(JsonBoardTaskView.getTitleWidget()).toBeNull();
    expect(JsonBoardTaskView.getWidget(undefined, TaskField.STATUS)).toBeNull();
  });
});
