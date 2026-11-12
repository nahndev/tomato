import { WidgetType } from '@tomato/constants';
import type { TemplateSnapshot, Widget } from '../../template-editor/template-editor.types';
import { describe, expect, it } from 'vitest';
import { ApplyChangesContext } from '../apply-changes-context';
import { buildDisplayDoc } from './submission-display.mapper';

const CREATED_AT = new Date('2026-10-19T08:00:00.000Z');

function snapshotOf(...widgets: Widget[]): TemplateSnapshot {
  return {
    name: 'Intake',
    widgets: Object.fromEntries(widgets.map((widget) => [widget.id, widget])),
    layouts: {},
    widgetToSession: {},
    sessions: {},
    links: {},
    behaviors: {},
  };
}

function widget(id: string, type: WidgetType, extra: Partial<Widget> = {}): Widget {
  return { id, type, label: id, ...extra };
}

describe('buildDisplayDoc', () => {
  it('backfills every widget with an empty value', () => {
    const doc = buildDisplayDoc(
      new ApplyChangesContext({
        createdAt: CREATED_AT,
        templateVersion: { snapshot: snapshotOf(widget('name', WidgetType.TEXT), widget('due', WidgetType.DATE)) },
      }),
    );

    expect(doc.name).toEqual({ default: { text: '' } });
    expect(doc.due).toEqual({ default: { date: null, text: '' } });
  });

  it('maps text and number values to text', () => {
    const doc = buildDisplayDoc(
      new ApplyChangesContext({
        createdAt: CREATED_AT,
        templateVersion: { snapshot: snapshotOf(widget('name', WidgetType.TEXT), widget('qty', WidgetType.NUMBER)) },
        data: { name: 'Ada', qty: 42 },
      }),
    );

    expect(doc.name.default).toEqual({ text: 'Ada' });
    expect(doc.qty.default).toEqual({ text: '42' });
  });

  it('resolves choice keys to option text, skipping unknown keys', () => {
    const options = [
      { key: 'a', value: 'Alpha', index: 'a0' },
      { key: 'b', value: 'Beta', index: 'a1' },
    ];
    const doc = buildDisplayDoc(
      new ApplyChangesContext({
        createdAt: CREATED_AT,
        templateVersion: { snapshot: snapshotOf(widget('pick', WidgetType.CHECKBOX, { options })) },
        data: { pick: ['b', 'gone', 'a'] },
      }),
    );

    expect(doc.pick.default).toEqual({ entity: ['b', 'gone', 'a'], text: 'Beta, Alpha' });
  });

  it('exposes date and time properties of a datetime widget', () => {
    const timestamp = Date.UTC(2026, 9, 19, 8, 30);
    const doc = buildDisplayDoc(
      new ApplyChangesContext({
        createdAt: CREATED_AT,
        templateVersion: { snapshot: snapshotOf(widget('at', WidgetType.DATETIME)) },
        data: { at: timestamp },
      }),
    );

    expect(Object.keys(doc.at)).toEqual(['default', 'date', 'time']);
    expect(doc.at.default.date).toBe(timestamp);
    expect(doc.at.time.text).toBe(new Date(timestamp).toLocaleTimeString());
  });

  it('reads created-at from the submission, not from its data', () => {
    const doc = buildDisplayDoc(
      new ApplyChangesContext({
        createdAt: CREATED_AT,
        templateVersion: { snapshot: snapshotOf(widget('meta', WidgetType.CREATED_AT)) },
        data: { meta: 1 },
      }),
    );

    expect(doc.meta.default.date).toBe(CREATED_AT.getTime());
  });
});
