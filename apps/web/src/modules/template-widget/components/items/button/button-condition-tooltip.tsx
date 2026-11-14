"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@tomato/ui";
import { CircleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { WidgetConditionError } from "../../../hooks/use-widget-conditions";
import { BUTTON_CONDITION_ITEMS } from "../../../template-widget.constants";

interface ButtonConditionTooltipProps {
  errors: WidgetConditionError[];
  children: ReactNode;
}

export function ButtonConditionTooltip({
  errors,
  children,
}: ButtonConditionTooltipProps) {
  if (errors.length === 0) return children;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="focus-ring block rounded-lg">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="flex max-w-72 flex-col p-0"
        >
          {errors.map((error) => (
            <ConditionErrorGroup key={error.type} error={error} />
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ConditionErrorGroup({ error }: { error: WidgetConditionError }) {
  return (
    <div className="flex flex-col gap-1.5 border-background/15 px-3 py-2 not-first:border-t">
      <div className="flex items-center gap-1.5">
        <CircleAlertIcon className="size-3.5 shrink-0 text-warning" />
        <Typography as="p" className="flex-1 font-medium">
          {BUTTON_CONDITION_ITEMS[error.type].label}
        </Typography>
        <div className="min-w-10"></div>
        <Typography className="rounded-full bg-background/15 px-1.5 text-[10px] leading-4 tabular-nums">
          {error.details.length}
        </Typography>
      </div>
      <ul className="flex flex-col gap-1 pl-5">
        {error.details.map((detail, index) => (
          <li
            key={index}
            className="flex items-start gap-1.5 text-background/80"
          >
            <span
              aria-hidden
              className="mt-1.5 size-1 shrink-0 rounded-full bg-background/50"
            />
            <Typography>{detail}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}
