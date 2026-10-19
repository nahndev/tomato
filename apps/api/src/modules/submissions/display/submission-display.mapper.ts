import { DisplayBucket, ValueType, WidgetType } from '@tomato/constants';
import type { SubmissionDisplayDoc, SubmissionDisplayValue, TemplateSnapshot, Widget } from '@tomato/types';

type ValueMap = SubmissionDisplayValue;
type PropertyMaps = Partial<Record<ValueType, ValueMap>>;

interface MappingSource {
  raw: unknown;
  widget: Widget;
  createdAt: Date;
}

type WidgetMapper = (source: MappingSource) => PropertyMaps;

const CHOICE_TEXT_SEPARATOR = ', ';

function textValue(raw: unknown): ValueMap {
  return { [DisplayBucket.TEXT]: raw === null || raw === undefined ? '' : String(raw) };
}

function entityValue(raw: unknown): string[] {
  if (raw === null || raw === undefined) return [];
  return (Array.isArray(raw) ? raw : [raw]).map(String);
}

function choiceValue(raw: unknown, widget: Widget): ValueMap {
  const entity = entityValue(raw);
  const textByKey = new Map((widget.options ?? []).map((option) => [option.key, option.value]));
  return {
    [DisplayBucket.ENTITY]: entity,
    [DisplayBucket.TEXT]: entity.flatMap((key) => textByKey.get(key) ?? []).join(CHOICE_TEXT_SEPARATOR),
  };
}

function dateValue(raw: unknown, format: (date: Date) => string): ValueMap {
  const timestamp = typeof raw === 'number' ? raw : null;
  return {
    [DisplayBucket.DATE]: timestamp,
    [DisplayBucket.TEXT]: timestamp === null ? '' : format(new Date(timestamp)),
  };
}

const formatDate = (date: Date) => date.toLocaleDateString();
const formatTime = (date: Date) => date.toLocaleTimeString();
const formatDateTime = (date: Date) => date.toLocaleString();

const mapText: WidgetMapper = ({ raw }) => ({ [ValueType.DEFAULT]: textValue(raw) });
const mapChoice: WidgetMapper = ({ raw, widget }) => ({ [ValueType.DEFAULT]: choiceValue(raw, widget) });

const WIDGET_MAPPERS: Partial<Record<WidgetType, WidgetMapper>> = {
  [WidgetType.TEXT]: mapText,
  [WidgetType.TEXT_AREA]: mapText,
  [WidgetType.SELECT]: mapChoice,
  [WidgetType.CHECKBOX]: mapChoice,
  [WidgetType.RADIO]: mapChoice,
  [WidgetType.DATE]: ({ raw }) => ({ [ValueType.DEFAULT]: dateValue(raw, formatDate) }),
  [WidgetType.TIME]: ({ raw }) => ({ [ValueType.DEFAULT]: dateValue(raw, formatTime) }),
  [WidgetType.CREATED_AT]: ({ createdAt }) => ({ [ValueType.DEFAULT]: dateValue(createdAt.getTime(), formatDate) }),
  [WidgetType.DATETIME]: ({ raw }) => ({
    [ValueType.DEFAULT]: dateValue(raw, formatDateTime),
    [ValueType.DATE]: dateValue(raw, formatDate),
    [ValueType.TIME]: dateValue(raw, formatTime),
  }),
};

/** Resolves every widget of the snapshot (not only the ones with data) so the board can render each cell without null checks. */
export function buildDisplayDoc(
  data: Record<string, unknown>,
  createdAt: Date,
  snapshot: TemplateSnapshot,
): SubmissionDisplayDoc {
  return Object.fromEntries(
    Object.values(snapshot.widgets).map((widget) => {
      const mapper = WIDGET_MAPPERS[widget.type] ?? mapText;
      return [widget.id, mapper({ raw: data[widget.id], widget, createdAt })];
    }),
  );
}
