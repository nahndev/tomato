"use client";

import { LinkTargetType } from "@tomato/constants";
import { useDependenciesByRefer, useDependencySourceId } from "@/modules/submission-dependency";
import { useWidget, useWidgetLink, useWidgetValue } from "@/modules/template-data";
import { buildSubmissionRefer } from "@tomato/protocol";
import { useMemo } from "react";
import { getPendingReferKeys, getReferSteps } from "./refer-submission";

export function useReferSteps(widgetId: string) {
  const link = useWidgetLink(widgetId);
  const usersWidgetId = link?.[LinkTargetType.WIDGET]?.uuid;
  const usersWidget = useWidget(usersWidgetId);
  const usersValue = useWidgetValue(usersWidgetId);
  const sourceId = useDependencySourceId();
  const refer = sourceId ? buildSubmissionRefer(sourceId, widgetId) : undefined;
  const dependencies = useDependenciesByRefer(refer);
  const steps = useMemo(() => getReferSteps(refer, usersValue, dependencies), [refer, usersValue, dependencies]);

  return {
    refer,
    usersWidget,
    usersValue,
    dependencies,
    steps,
    hasChanges: getPendingReferKeys(steps).size > 0,
    isLinked: Boolean(usersWidget && link?.[LinkTargetType.TEMPLATE]),
  };
}
