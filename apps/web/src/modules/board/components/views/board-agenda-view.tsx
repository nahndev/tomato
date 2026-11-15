"use client";

import { Button, cn, Typography } from "@tomato/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AGENDA_MIN_LANES } from "../../board.constants";
import type { Board, Submission } from "../../board.types";
import { getAgendaItem, getDayIndex, getWeekDays, getWeekStart, layoutAgendaBars, shiftWeek } from "../../utils/agenda";
import { AgendaBar } from "./agenda-bar";

interface BoardAgendaViewProps {
  board: Board;
  submissions: Submission[];
  weekStart: number;
  onWeekChange: (weekStart: number) => void;
}

export function BoardAgendaView({ board, submissions, weekStart, onWeekChange }: BoardAgendaViewProps) {
  const templateNames = new Map(board.templates.map(({ templateId, template }) => [templateId, template.name]));
  const items = submissions.flatMap((submission) => {
    const { templateId } = submission.templateVersion;
    return getAgendaItem(submission, board.agendaSetting[templateId], templateNames.get(templateId)) ?? [];
  });
  const bars = layoutAgendaBars(items, weekStart);
  const laneCount = Math.max(AGENDA_MIN_LANES, ...bars.map((bar) => bar.lane + 1));
  const days = getWeekDays(weekStart);
  const todayIndex = getDayIndex(Date.now(), weekStart);
  const weekLabel = `${days[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${days[days.length - 1].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Previous week" onClick={() => onWeekChange(shiftWeek(weekStart, -1))}>
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onWeekChange(getWeekStart(new Date()))}>
          <Typography>Today</Typography>
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Next week" onClick={() => onWeekChange(shiftWeek(weekStart, 1))}>
          <ChevronRightIcon />
        </Button>
        <Typography as="h2" className="text-sm font-medium">{weekLabel}</Typography>
      </div>
      <div
        aria-label="Agenda"
        className="grid grid-cols-7 overflow-hidden rounded-lg bg-card pb-1 shadow-card"
        style={{ gridTemplateRows: `auto repeat(${laneCount}, 2rem)` }}
      >
        {days.map((day, index) => (
          <div
            key={day.getTime()}
            className="flex flex-col items-center gap-0.5 border-b border-l border-border py-2 first:border-l-0"
            style={{ gridColumn: index + 1, gridRow: 1 }}
          >
            <Typography className="text-xs text-muted-foreground">
              {day.toLocaleDateString(undefined, { weekday: "short" })}
            </Typography>
            <Typography
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm font-medium",
                index === todayIndex && "bg-primary text-primary-foreground",
              )}
            >
              {day.getDate()}
            </Typography>
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={`column-${day.getTime()}`}
            aria-hidden
            className={cn(index > 0 && "border-l border-border")}
            style={{ gridColumn: index + 1, gridRow: "2 / -1" }}
          />
        ))}
        {bars.map((bar) => (
          <AgendaBar key={bar.item.submissionId} bar={bar} />
        ))}
      </div>
      {bars.length === 0 && (
        <Typography as="p" className="text-sm text-muted-foreground">No submissions this week.</Typography>
      )}
    </div>
  );
}
