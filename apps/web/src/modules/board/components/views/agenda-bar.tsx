import { cn, Typography } from "@tomato/ui";
import Link from "next/link";
import { getSubmissionPath } from "@/modules/submission-dependency";
import type { AgendaBar as AgendaBarValues } from "../../utils/agenda";

interface AgendaBarProps {
  bar: AgendaBarValues;
}

export function AgendaBar({ bar }: AgendaBarProps) {
  return (
    <Link
      href={getSubmissionPath(bar.item.submissionId)}
      title={bar.item.title}
      className={cn(
        "my-0.5 flex min-w-0 items-center rounded-md bg-soft px-2 text-xs font-medium text-soft-foreground hover:bg-soft-hover",
        bar.continuesBefore ? "rounded-l-none" : "ml-1",
        bar.continuesAfter ? "rounded-r-none" : "mr-1",
      )}
      style={{ gridColumn: `${bar.startColumn + 1} / span ${bar.span}`, gridRow: bar.lane + 2 }}
    >
      <Typography className="truncate">{bar.item.title}</Typography>
    </Link>
  );
}
