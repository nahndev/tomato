import { WidgetType } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import type { SubmissionClocksEntity } from './submissions.types';
import { MetaChanges, ValueChanges } from './value-changes';

const ENTITY = {
  data: { name: 'Ada', notes: 'Old' },
  dataClocks: { name: 3, notes: 1 },
  metaClocks: { title: 2 },
  templateVersion: {
    snapshot: {
      widgets: {
        name: { id: 'name', type: WidgetType.TEXT, label: 'Name' },
        notes: { id: 'notes', type: WidgetType.TEXT, label: 'Notes' },
      },
    },
  },
} as unknown as SubmissionClocksEntity;

describe('ValueChanges', () => {
  it('reports only the widgets of the template whose clock changed', () => {
    const changes = new ValueChanges(ENTITY, {
      name: { value: 'Stale', clock: 3 },
      notes: { value: 'New', clock: 2 },
      rogue: { value: 'x', clock: 1 },
    });

    expect(changes.has('name')).toBe(false);
    expect(changes.has('notes')).toBe(true);
    expect(changes.has('rogue')).toBe(false);
    expect(changes.isEmpty).toBe(false);
    expect(changes.toEntries()).toEqual([['notes', { value: 'New', clock: 2 }]]);
  });

  it('is empty when nothing changed', () => {
    const changes = new ValueChanges(ENTITY, { name: { value: 'Stale', clock: 3 } });

    expect(changes.isEmpty).toBe(true);
  });
});

describe('MetaChanges', () => {
  it('reports only a title whose clock changed', () => {
    const changes = new MetaChanges(ENTITY, {
      title: { value: 'Intake of Ada', clock: 3 },
      updated: { value: 1, clock: 4 },
      rogue: { value: 'x', clock: 1 },
    });

    expect(changes.toEntries()).toEqual([['title', { value: 'Intake of Ada', clock: 3 }]]);
  });

  it('is empty when the title clock did not change', () => {
    expect(new MetaChanges(ENTITY, { title: { value: 'Stale', clock: 2 } }).isEmpty).toBe(true);
  });
});
