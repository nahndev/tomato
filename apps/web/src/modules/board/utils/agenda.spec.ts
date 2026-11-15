import { describe, expect, it } from "vitest";
import type { BoardAgendaSetting, Submission } from "../board.types";
import { getAgendaItem, getDayIndex, getWeekDays, getWeekRange, getWeekStart, layoutAgendaBars, shiftWeek } from "./agenda";
import type { AgendaItem } from "./agenda";

const MONDAY = new Date(2026, 10, 9).getTime();
const at = (day: number, hours = 9) => new Date(2026, 10, day, hours).getTime();

const SETTING: BoardAgendaSetting = { titleWidget: "w-title", startWidget: "w-start", endWidget: "w-end" };

function submission(dataDisplays: Submission["dataDisplays"], title = "Submission title"): Submission {
  return {
    id: "s1",
    templateVersionId: "v1",
    templateVersion: { templateId: "template-a" },
    data: {},
    dataDisplays,
    title,
    createdAt: "",
    updatedAt: "",
  };
}

const item = (id: string, start: number, end = start): AgendaItem => ({ submissionId: id, title: id, start, end });

describe("week helpers", () => {
  it("starts the week on Monday at local midnight", () => {
    expect(getWeekStart(new Date(2026, 10, 9, 15))).toBe(MONDAY);
    expect(getWeekStart(new Date(2026, 10, 15, 23))).toBe(MONDAY);
    expect(getWeekStart(new Date(2026, 10, 16, 0))).toBe(new Date(2026, 10, 16).getTime());
  });

  it("gives the seven days and the range of a week", () => {
    expect(getWeekDays(MONDAY).map((day) => day.getDate())).toEqual([9, 10, 11, 12, 13, 14, 15]);
    expect(getWeekRange(MONDAY)).toEqual({ from: MONDAY, to: new Date(2026, 10, 16).getTime() });
    expect(shiftWeek(MONDAY, -1)).toBe(new Date(2026, 10, 2).getTime());
  });

  it("gives the day index of a timestamp relative to the week", () => {
    expect(getDayIndex(at(9), MONDAY)).toBe(0);
    expect(getDayIndex(at(15, 23), MONDAY)).toBe(6);
    expect(getDayIndex(at(7), MONDAY)).toBe(-2);
  });
});

describe("getAgendaItem", () => {
  it("reads the title, start and end widgets", () => {
    const values = submission({
      "w-title": { default: { text: "Kick-off" } },
      "w-start": { default: { date: at(10) } },
      "w-end": { default: { date: at(12) } },
    });

    expect(getAgendaItem(values, SETTING, "Intake")).toEqual({ submissionId: "s1", title: "Kick-off", start: at(10), end: at(12) });
  });

  it("ends on the start day without an end, and never before the start", () => {
    const withoutEnd = submission({ "w-start": { default: { date: at(10) } }, "w-end": { default: { date: null } } });
    const endBeforeStart = submission({ "w-start": { default: { date: at(10) } }, "w-end": { default: { date: at(8) } } });

    expect(getAgendaItem(withoutEnd, SETTING, "Intake")?.end).toBe(at(10));
    expect(getAgendaItem(endBeforeStart, SETTING, "Intake")?.end).toBe(at(10));
  });

  it("falls back to the submission title, then the template name", () => {
    const start = { "w-start": { default: { date: at(10) } } };

    expect(getAgendaItem(submission(start), SETTING, "Intake")?.title).toBe("Submission title");
    expect(getAgendaItem(submission(start, ""), SETTING, "Intake")?.title).toBe("Intake");
  });

  it("returns null without a start date or a setting", () => {
    expect(getAgendaItem(submission({ "w-start": { default: { date: null } } }), SETTING, "Intake")).toBeNull();
    expect(getAgendaItem(submission({ "w-start": { default: { date: at(10) } } }), undefined, "Intake")).toBeNull();
  });
});

describe("layoutAgendaBars", () => {
  it("places bars on their days and stacks overlapping ones in lanes", () => {
    const bars = layoutAgendaBars([item("b", at(11), at(13)), item("a", at(9), at(11)), item("c", at(12))], MONDAY);

    expect(bars.map(({ item: { submissionId }, startColumn, span, lane }) => ({ submissionId, startColumn, span, lane }))).toEqual([
      { submissionId: "a", startColumn: 0, span: 3, lane: 0 },
      { submissionId: "b", startColumn: 2, span: 3, lane: 1 },
      { submissionId: "c", startColumn: 3, span: 1, lane: 0 },
    ]);
  });

  it("clips bars that run past the week", () => {
    const [bar] = layoutAgendaBars([item("a", at(6), at(18))], MONDAY);

    expect(bar).toMatchObject({ startColumn: 0, span: 7, continuesBefore: true, continuesAfter: true });
  });

  it("drops items outside the week", () => {
    expect(layoutAgendaBars([item("a", at(2), at(8)), item("b", at(16))], MONDAY)).toEqual([]);
  });
});
