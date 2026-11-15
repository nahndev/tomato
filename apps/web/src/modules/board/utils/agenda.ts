import { DAYS_PER_WEEK, MS_PER_DAY } from "../board.constants";
import type { BoardAgendaRange, BoardAgendaSetting, Submission } from "../board.types";
import { getWidgetLabel, getWidgetTimestamp } from "./display-value";

export interface AgendaItem {
  submissionId: string;
  title: string;
  start: number;
  end: number;
}

export interface AgendaBar {
  item: AgendaItem;
  startColumn: number;
  span: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

function addDays(timestamp: number, days: number): number {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

function startOfDay(timestamp: number): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

export function getWeekStart(date: Date): number {
  const day = startOfDay(date.getTime());
  return addDays(day, -((new Date(day).getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK));
}

export function shiftWeek(weekStart: number, weeks: number): number {
  return addDays(weekStart, weeks * DAYS_PER_WEEK);
}

export function getWeekRange(weekStart: number): BoardAgendaRange {
  return { from: weekStart, to: shiftWeek(weekStart, 1) };
}

export function getWeekDays(weekStart: number): Date[] {
  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => new Date(addDays(weekStart, index)));
}

export function getDayIndex(timestamp: number, weekStart: number): number {
  return Math.round((startOfDay(timestamp) - weekStart) / MS_PER_DAY);
}

export function getAgendaItem(
  submission: Submission,
  setting: BoardAgendaSetting | undefined,
  templateName: string | undefined,
): AgendaItem | null {
  const start = getWidgetTimestamp(submission, setting?.startWidget ?? null);
  if (start === null) return null;
  const end = getWidgetTimestamp(submission, setting?.endWidget ?? null) ?? start;
  return {
    submissionId: submission.id,
    title: getWidgetLabel(submission, setting?.titleWidget) || submission.title || templateName || "Untitled",
    start,
    end: Math.max(start, end),
  };
}

export function layoutAgendaBars(items: AgendaItem[], weekStart: number): AgendaBar[] {
  const lastColumn = DAYS_PER_WEEK - 1;
  const laneEnds: number[] = [];
  return items
    .map((item) => ({ item, first: getDayIndex(item.start, weekStart), last: getDayIndex(item.end, weekStart) }))
    .filter(({ first, last }) => last >= 0 && first <= lastColumn)
    .sort((a, b) => a.first - b.first || b.last - a.last)
    .map(({ item, first, last }) => {
      const startColumn = Math.max(first, 0);
      const endColumn = Math.min(last, lastColumn);
      const freeLane = laneEnds.findIndex((end) => end < startColumn);
      const lane = freeLane === -1 ? laneEnds.length : freeLane;
      laneEnds[lane] = endColumn;
      return {
        item,
        startColumn,
        span: endColumn - startColumn + 1,
        lane,
        continuesBefore: first < 0,
        continuesAfter: last > lastColumn,
      };
    });
}
